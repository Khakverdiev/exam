using System.Net.Mail;
using System.Net.Mime;
using AuthAndProductData.Contexts;
using AuthAndProductData.DTOs;
using AuthAndProductData.Models;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using ProductService.Interfaces;
using System.IO;
using iTextSharp.text;
using iTextSharp.text.pdf;
using Microsoft.Extensions.Configuration;

namespace ProductService.Classes;

public class OrderService : IOrderService
{
    private readonly AuthContext _context;
    private readonly IMapper _mapper;
    private readonly IConfiguration _configuration;

    public OrderService(AuthContext context, IMapper mapper, IConfiguration configuration)
    {
        _context = context;
        _mapper = mapper;
        _configuration = configuration;
    }
    
    public async Task<OrderDto> CreateOrderAsync(OrderRequestDto request)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == request.Username);
            if (user == null)
                throw new Exception("User not found.");

            var orderStatus = await _context.OrderStatuses.FirstOrDefaultAsync(s => s.StatusName == "Pending");
            if (orderStatus == null)
            {
                orderStatus = new OrderStatus { StatusName = "Pending" };
                _context.OrderStatuses.Add(orderStatus);
                await _context.SaveChangesAsync();
            }

            var order = _mapper.Map<Order>(request);
            order.User = user;
            order.OrderStatusId = orderStatus.StatusId;

            foreach (var item in order.OrderItems)
            {
                var product = await _context.Products.FindAsync(item.ProductId);
                if (product == null)
                    throw new Exception($"Product with ID {item.ProductId} not found.");

                if (product.Quantity < item.Quantity)
                    throw new Exception($"Not enough stock for product: {product.Name}.");

                product.Quantity -= item.Quantity;
            }

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return _mapper.Map<OrderDto>(order);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            Console.WriteLine("Ошибка при создании заказа: " + ex.Message);
            if (ex.InnerException != null)
                Console.WriteLine("Вложенное исключение: " + ex.InnerException.Message);
            throw;
        }
    }

    public async Task<OrderDto> GetOrderByIdAsync(int orderId)
    {
        var order = await _context.Orders
            .Include(o => o.User)
            .Include(o => o.OrderItems).ThenInclude(oi => oi.Product)
            .Include(o => o.ShippingAddress)
            .Include(o => o.OrderStatus)
            .FirstOrDefaultAsync(o => o.Id == orderId);

        return order != null ? _mapper.Map<OrderDto>(order) : null;
    }

    public async Task<IEnumerable<OrderDto>> GetAllOrdersAsync()
    {
        var orders = await _context.Orders
            .Include(o => o.User)
            .Include(o => o.OrderItems).ThenInclude(oi => oi.Product)
            .Include(o => o.ShippingAddress)
            .Include(o => o.OrderStatus)
            .ToListAsync();

        return _mapper.Map<IEnumerable<OrderDto>>(orders);
    }

    public async Task<OrderDto> UpdateOrderStatusAsync(int orderId, string newStatus)
    {
        var order = await _context.Orders
            .Include(o => o.OrderStatus)
            .FirstOrDefaultAsync(o => o.Id == orderId);

        if (order == null)
        {
            return null;
        }
        
        var orderStatus = await _context.OrderStatuses.FirstOrDefaultAsync(os => os.StatusName == newStatus);

        if (orderStatus == null)
        {
            orderStatus = new OrderStatus { StatusName = newStatus };
            _context.OrderStatuses.Add(orderStatus);
            await _context.SaveChangesAsync();
        }

        order.OrderStatus = orderStatus;
        await _context.SaveChangesAsync();

        return _mapper.Map<OrderDto>(order);
    }

    public async Task DeleteOrderAsync(int orderId)
    {
        var order = await _context.Orders.FindAsync(orderId);

        if (order == null)
            throw new KeyNotFoundException($"Order with ID {orderId} not found.");

        _context.Orders.Remove(order);
        await _context.SaveChangesAsync();
    }
    
    public async Task SendOrderReceiptByEmailAsync(int orderId)
    {
        var order = await _context.Orders
            .Include(o => o.User)
            .Include(o => o.OrderItems).ThenInclude(oi => oi.Product)
            .Include(o => o.ShippingAddress)
            .FirstOrDefaultAsync(o => o.Id == orderId);
    
        if (order == null)
            throw new KeyNotFoundException("Order not found.");
    
        var user = order.User;
        if (user == null || string.IsNullOrEmpty(user.Email))
            throw new Exception("User email not found.");
    
        var pdfPath = Path.Combine(Path.GetTempPath(), $"OrderReceipt_{orderId}.pdf");
    
        try
        {
            using (var fs = new FileStream(pdfPath, FileMode.Create, FileAccess.Write, FileShare.None))
            {
                var document = new Document();
                PdfWriter.GetInstance(document, fs);
                document.Open();
    
                document.Add(new Paragraph("Order Receipt", FontFactory.GetFont("Arial", 16, Font.BOLD)));
                document.Add(new Paragraph($"Order ID: {order.Id}"));
                document.Add(new Paragraph($"Date: {order.CreatedAt:yyyy-MM-dd}"));
                document.Add(new Paragraph($"Total Price: ${order.TotalPrice:F2}"));
                document.Add(new Paragraph(" "));
    
                var table = new PdfPTable(4) { WidthPercentage = 100 };
                table.AddCell("Product Name");
                table.AddCell("Quantity");
                table.AddCell("Price");
                table.AddCell("Size");
    
                foreach (var item in order.OrderItems)
                {
                    table.AddCell(item.Product.Name);
                    table.AddCell(item.Quantity.ToString());
                    table.AddCell($"${item.Price:F2}");
                    table.AddCell(item.Size ?? "N/A");
                }
    
                document.Add(table);
                document.Close();
            }
    
            var emailSettings = _configuration.GetSection("Email");
            var smtpHost = emailSettings["Host"];
            var smtpPortString = emailSettings["Port"];
            var smtpUsername = emailSettings["Username"];
            var smtpPassword = emailSettings["Password"];
    
            if (string.IsNullOrEmpty(smtpPortString))
            {
                throw new Exception("SMTP port is not configured in the application settings.");
            }

            if (!int.TryParse(smtpPortString, out var smtpPort))
            {
                throw new Exception("SMTP port is not a valid integer.");
            }
            
            using (var smtpClient = new SmtpClient(smtpHost, smtpPort))
            {
                smtpClient.Credentials = new System.Net.NetworkCredential(smtpUsername, smtpPassword);
                smtpClient.EnableSsl = true;
    
                var mailMessage = new MailMessage
                {
                    From = new MailAddress(smtpUsername, "Shop Admin"),
                    Subject = "Your Order Receipt",
                    Body = "Thank you for your order! Please find your receipt attached.",
                    IsBodyHtml = false,
                };
    
                mailMessage.To.Add(user.Email);
    
                mailMessage.Attachments.Add(new Attachment(pdfPath, MediaTypeNames.Application.Pdf));
    
                await smtpClient.SendMailAsync(mailMessage);
            }
        }
        finally
        {
            if (File.Exists(pdfPath))
            {
                File.Delete(pdfPath);
            }
        }
    }
}