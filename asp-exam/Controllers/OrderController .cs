using aspnetexam.Data.Contexts;
using aspnetexam.Data.Models;
using aspnetexam.Data.Models.DTOs;
using aspnetexam.Mappers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace aspnetexam.Controllers;

[Route("api/order")]
[ApiController]
public class OrderController : Controller
{
    private readonly AuthContext _context;

    public OrderController(AuthContext context)
    {
        _context = context;
    }
    
    [HttpPost("create")]
    [Authorize(Roles = "appuser, appadmin")]
    public async Task<IActionResult> CreateOrder([FromBody] OrderRequestDto request)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            var user = await _context.Users.FindAsync(request.UserId);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            var order = request.ToOrder();
            order.User = user;
            
            foreach (var item in order.OrderItems)
            {
                var product = await _context.Products.FindAsync(item.ProductId);
                if (product == null)
                {
                    return NotFound($"Product with ID {item.ProductId} not found.");
                }

                if (product.Quantity < item.Quantity)
                {
                    return BadRequest($"Not enough stock for product: {product.Name}. Available: {product.Quantity}, Requested: {item.Quantity}");
                }

                product.Quantity -= item.Quantity;
            }

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            await transaction.CommitAsync();

            var orderDto = order.ToOrderDto();
            return Ok(orderDto);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return StatusCode(500, $"An error occurred while creating the order: {ex.Message}");
        }
    }

    [HttpGet("{orderId}")]
    [Authorize(Roles = "appuser, appadmin")]
    public async Task<IActionResult> GetOrderById(int orderId)
    {
        var order = await _context.Orders
            .Include(o => o.User)
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Product)
            .Include(o => o.ShippingAddress)
            .Include(o => o.PaymentDetails)
            .FirstOrDefaultAsync(o => o.Id == orderId);
        
        if (order == null)
        {
            return NotFound("Order not found.");
        }
        
        var orderDto = order.ToOrderDto();
        return Ok(orderDto);
    }

    [HttpGet("all")]
    [Authorize(Roles = "appadmin")]
    public async Task<IActionResult> GetAllOrders()
    {
        var orders = await _context.Orders
            .Include(o => o.User)
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Product)
            .Include(o => o.ShippingAddress)
            .ToListAsync();

        var ordersDto = orders.Select(o => o.ToOrderDto()).ToList();
        return Ok(ordersDto);
    }

    [HttpPut("{orderId}/update-status")]
    [Authorize(Roles = "appadmin")]
    public async Task<IActionResult> UpdateOrderStatus(int orderId, [FromBody] string newStatus)
    {
        var order = await _context.Orders.FindAsync(orderId);

        if (order == null)
        {
            return NotFound("Order not found.");
        }

        order.Status = newStatus;
        await _context.SaveChangesAsync();

        var orderDto = order.ToOrderDto();
        return Ok(orderDto);
    }
}
