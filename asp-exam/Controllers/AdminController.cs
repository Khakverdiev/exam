using aspnetexam.Data.Contexts;
using aspnetexam.Data.Models;
using aspnetexam.Data.Models.DTOs;
using aspnetexam.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace aspnetexam.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "appadmin")]
public class AdminController : Controller
{
    private readonly IAdminService _adminService;
    private readonly IBlobService _blobService;
    private readonly AuthContext _context;

    public AdminController(IAdminService adminService, IBlobService blobService, AuthContext context)
    {
        _adminService = adminService;
        _blobService = blobService;
        _context = context;
    }
    
    [HttpGet("products")]
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetAllProducts()
    {
        try
        {
            var products = await _context.Products.ToListAsync();
        
            var productDtos = products.Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                Price = p.Price,
                Quantity = p.Quantity,
                Category = p.Category,
                ImageUrl = p.ImageUrl,
            }).ToList();

            return Ok(productDtos);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Ошибка на сервере: {ex.Message}");
        }
    }
    
    [HttpPost("product")]
    public async Task<IActionResult> AddProduct([FromForm] ProductCreateDto  productDto)
    {
        if (productDto == null || productDto.ImageFile == null)
        {
            return BadRequest("Необходимо указать данные продукта и изображение.");
        }

        var imageUrl = await _blobService.UploadFileAsync(productDto.ImageFile);

        if (string.IsNullOrEmpty(imageUrl))
        {
            return StatusCode(500, "Ошибка при загрузке изображения.");
        }

        var product = new Product
        {
            Name = productDto.Name,
            Description = productDto.Description,
            Price = productDto.Price,
            Quantity = productDto.Quantity,
            Category = productDto.Category,
            ImageUrl = imageUrl
        };

        await _adminService.AddProductAsync(product);
        return Ok("Продукт добавлен успешно.");
    }
    
    [HttpPut("product/{id}")]
    public async Task<IActionResult> UpdateProduct(int id, [FromForm] ProductCreateDto  productDto)
    {
        if (productDto == null)
        {
            return BadRequest("Необходимо указать данные продукта.");
        }

        var existingProduct = await _context.Products.FindAsync(id);
        if (existingProduct == null)
        {
            return NotFound("Продукт не найден.");
        }

        if (productDto.ImageFile != null)
        {
            var imageUrl = await _blobService.UploadFileAsync(productDto.ImageFile);
            if (string.IsNullOrEmpty(imageUrl))
            {
                return StatusCode(500, "Ошибка при загрузке изображения.");
            }
            existingProduct.ImageUrl = imageUrl;
        }

        existingProduct.Name = productDto.Name;
        existingProduct.Description = productDto.Description;
        existingProduct.Price = productDto.Price;
        existingProduct.Quantity = productDto.Quantity;
        existingProduct.Category = productDto.Category;

        await _context.SaveChangesAsync();

        return Ok("Продукт обновлен успешно.");
    }
    
    [HttpDelete("product/{id}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
        {
            return NotFound("Продукт не найден.");
        }

        await _adminService.DeleteProductAsync(id);
        return Ok("Продукт удален успешно.");
    }
    
    [HttpGet("users")]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await _adminService.GetAllUsersAsync();
        return Ok(users);
    }
    
    [HttpPut("user/{userId}/role")]
    public async Task<IActionResult> UpdateUserRole(Guid userId, [FromBody] string role)
    {
        if (role != "appuser" && role != "appadmin")
        {
            return BadRequest("Неверная роль.");
        }

        await _adminService.UpdateUserRoleAsync(userId, role);
        return Ok("Роль пользователя обновлена успешно.");
    }
    
    [HttpGet("reviews")]
    public async Task<IActionResult> GetAllReviews()
    {
        var reviews = await _adminService.GetAllReviewsAsync();
        return Ok(reviews);
    }
    
    [HttpGet("orders")]
    public async Task<IActionResult> GetAllOrders()
    {
        var orders = await _adminService.GetAllOrdersAsync();
        return Ok(orders);
    }
}