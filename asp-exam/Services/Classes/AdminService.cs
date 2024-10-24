using aspnetexam.Data.Contexts;
using aspnetexam.Data.Models;
using aspnetexam.Data.Models.DTOs;
using aspnetexam.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace aspnetexam.Services.Classes;

public class AdminService : IAdminService
{
    private readonly AuthContext _context;
    private readonly IBlobService _blobService;

    public AdminService(AuthContext context, IBlobService blobService)
    {
        _context = context;
        _blobService = blobService;
    }

    public async Task<IEnumerable<Product>> GetAllProductsAsync()
    {
        return await _context.Products.ToListAsync();
    }

    public async Task AddProductAsync(Product product)
    {
        _context.Products.Add(product);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateProductAsync(int productId, Product product)
    {
        var existingProduct = await _context.Products.FindAsync(productId);
        if (existingProduct != null)
        {
            existingProduct.Name = product.Name;
            existingProduct.Description = product.Description;
            existingProduct.Price = product.Price;
            existingProduct.Quantity = product.Quantity;
            existingProduct.ImageUrl = product.ImageUrl;
            existingProduct.Category = product.Category;

            await _context.SaveChangesAsync();
        }
    }

    public async Task DeleteProductAsync(int productId)
    {
        var product = await _context.Products.FindAsync(productId);
        if (product != null)
        {
            if (!string.IsNullOrEmpty(product.ImageUrl))
            {
                var imageName = Path.GetFileName(new Uri(product.ImageUrl).AbsolutePath);

                var isDeleted = await _blobService.DeleteFileAsync(imageName);
                if (!isDeleted)
                {
                    throw new Exception("Ошибка при удалении изображения из Blob Storage.");
                }
            }
            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<IEnumerable<User>> GetAllUsersAsync()
    {
        return await _context.Users.ToListAsync();
    }

    public async Task UpdateUserRoleAsync(Guid userId, string role)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user != null)
        {
            user.Role = role;
            await _context.SaveChangesAsync();
        }
    }

    public async Task<IEnumerable<ReviewDto>> GetAllReviewsAsync()
    {
        var reviews = await _context.Reviews
            .Include(r => r.User)
            .Include(r => r.Product)
            .ToListAsync();
        
        return reviews.Select(r => new ReviewDto
        {
            Id = r.Id,
            UserId = r.UserId,
            Username = r.User.Username,
            ProductId = r.ProductId,
            ProductName = r.Product.Name,
            ProductImageUrl = r.Product.ImageUrl,
            ReviewText = r.ReviewText,
            Rating = r.Rating,
            CreatedAt = r.CreatedAt
        });
    }

    public async Task<IEnumerable<Order>> GetAllOrdersAsync()
    {
        return await _context.Orders
            .Include(o => o.OrderItems)
            .Include(o => o.ShippingAddress)
            .Include(o => o.PaymentDetails)
            .ToListAsync();
    }
}