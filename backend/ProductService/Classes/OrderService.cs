using AuthAndProductData.Contexts;
using AuthAndProductData.DTOs;
using AuthAndProductData.Models;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using ProductService.Interfaces;

namespace ProductService.Classes;

public class OrderService : IOrderService
{
    private readonly AuthContext _context;
    private readonly IMapper _mapper;

    public OrderService(AuthContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
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
}