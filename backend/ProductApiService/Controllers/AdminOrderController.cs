using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProductService.Interfaces;

namespace ProductApiService.Controllers;

[Authorize(Policy = "AdminPolicy")]
[ApiController]
[Route("api/admin/orders")]
public class AdminOrderController : ControllerBase
{
    private readonly IOrderService _orderService;

    public AdminOrderController(IOrderService orderService)
    {
        _orderService = orderService;
    }
    
    [HttpGet("{orderId}")]
    public async Task<IActionResult> GetOrderById(int orderId)
    {
        var orderDto = await _orderService.GetOrderByIdAsync(orderId);

        if (orderDto == null)
            return NotFound("Order not found.");

        return Ok(orderDto);
    }

    [HttpGet]
    public async Task<IActionResult> GetAllOrders()
    {
        var ordersDto = await _orderService.GetAllOrdersAsync();
        return Ok(ordersDto);
    }

    [HttpPut("{orderId}/update-status")]
    public async Task<IActionResult> UpdateOrderStatus(int orderId, [FromBody] string newStatus)
    {
        var updatedOrderDto = await _orderService.UpdateOrderStatusAsync(orderId, newStatus);

        if (updatedOrderDto == null)
            return NotFound("Order not found.");

        return Ok(updatedOrderDto);
    }

    [HttpDelete("{orderId}")]
    public async Task<IActionResult> DeleteOrder(int orderId)
    {
        try
        {
            await _orderService.DeleteOrderAsync(orderId);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }
}