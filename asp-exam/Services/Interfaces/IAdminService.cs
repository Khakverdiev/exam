using aspnetexam.Data.Models;
using aspnetexam.Data.Models.DTOs;

namespace aspnetexam.Services.Interfaces;

public interface IAdminService
{
    Task<IEnumerable<Product>> GetAllProductsAsync();
    Task AddProductAsync(Product product);
    Task UpdateProductAsync(int productId, Product product);
    Task DeleteProductAsync(int productId);
    Task<IEnumerable<User>> GetAllUsersAsync();
    Task UpdateUserRoleAsync(Guid userId, string role);
    Task<IEnumerable<ReviewDto>> GetAllReviewsAsync();
    Task<IEnumerable<Order>> GetAllOrdersAsync();
}