using AuthAndProductData.DTOs;
using AuthAndProductData.Models;

namespace ProductService.Interfaces;

public interface IOrderService
{
    Task<OrderDto> CreateOrderAsync(OrderRequestDto orderCreateDto);
    Task<OrderDto> GetOrderByIdAsync(int orderId);
    Task<IEnumerable<OrderDto>> GetAllOrdersAsync();
    Task<OrderDto> UpdateOrderStatusAsync(int orderId, string newStatus);
    Task DeleteOrderAsync(int orderId);
}