using System.Security.Claims;
using AuthAndProductData.Contexts;
using AuthAndProductData.DTOs;
using AuthAndProductData.Models;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProductService.Interfaces;

namespace ProductApiService.Controllers;

[Authorize]
[Route("api/order")]
[ApiController]
public class UserOrderController : ControllerBase
{
    private readonly IOrderService _orderService;
    private readonly AuthContext _context;
    private readonly IMapper _mapper;
    private readonly ILogger<UserOrderController> _logger;

    public UserOrderController(IOrderService orderService, AuthContext context, IMapper mapper, ILogger<UserOrderController> logger)
    {
        _orderService = orderService;
        _context = context;
        _mapper = mapper;
        _logger = logger;
    }

    [HttpPost("create")]
    public async Task<IActionResult> CreateOrder([FromBody] OrderRequestDto request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var order = _mapper.Map<Order>(request);
            order.CreatedAt = DateTime.UtcNow;

            var orderStatus = await _context.OrderStatuses.FirstOrDefaultAsync(s => s.StatusId == order.OrderStatusId)
                              ?? new OrderStatus { StatusName = "Pending" };
            order.OrderStatus = orderStatus;
            
            order.User = await _context.Users.FirstOrDefaultAsync(u => u.Username == order.Username);
            
            order.TotalPrice = order.OrderItems.Sum(i => i.Quantity * i.Price);

            _context.Orders.Add(order);

            var productIds = order.OrderItems.Select(item => item.ProductId).ToList();
            var products = await _context.Products.Where(p => productIds.Contains(p.Id)).ToDictionaryAsync(p => p.Id);

            foreach (var orderItem in order.OrderItems)
            {
                if (products.TryGetValue(orderItem.ProductId, out var product))
                {
                    if (product.Quantity >= orderItem.Quantity)
                    {
                        product.Quantity -= orderItem.Quantity;
                    }
                    else
                    {
                        return BadRequest($"Not enough stock for product {product.Name}");
                    }
                }
                else
                {
                    return BadRequest($"Product with ID {orderItem.ProductId} not found.");
                }
            }

            await _context.SaveChangesAsync();

            var orderDto = _mapper.Map<OrderDto>(order);
            return Ok(orderDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while creating an order.");
            return StatusCode(500, "An error occurred while creating the order.");
        }
    }

    [HttpGet("{orderId}")]
    public async Task<IActionResult> GetOrderById(int orderId)
    {
        var orderDto = await _orderService.GetOrderByIdAsync(orderId);

        if (orderDto == null)
            return NotFound("Order not found.");

        return Ok(orderDto);
    }

    [HttpGet("all")]
    public async Task<IActionResult> GetAllOrders()
    {
        var ordersDto = await _orderService.GetAllOrdersAsync();
        return Ok(ordersDto);
    }
    
    [HttpPost("send-receipt/{orderId}")]
    public async Task<IActionResult> SendReceipt(int orderId)
    {
        try
        {
            var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
        
            if (user == null)
                return Unauthorized("User not found.");
        
            await _orderService.SendOrderReceiptByEmailAsync(orderId);
            return Ok("Receipt sent successfully.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while sending receipt.");
            return StatusCode(500, "An error occurred while sending the receipt.");
        }
    }
}