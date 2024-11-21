using aspnetexam.Data.Models;
using aspnetexam.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace aspnetexam.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "appadmin")]
public class AdminController : Controller
{
    private readonly IAdminService _adminService;

    public AdminController(IAdminService adminService)
    {
        _adminService = adminService;
    }
    
    [HttpGet("products")]
    public async Task<IActionResult> GetAllProducts()
    {
        var products = await _adminService.GetAllProductsAsync();
        return Ok(products);
    }
    
    [HttpPost("product")]
    public async Task<IActionResult> AddProduct([FromBody] Product product)
    {
        await _adminService.AddProductAsync(product);
        return Ok("Продукт добавлен успешно.");
    }
    
    [HttpPut("product/{id}")]
    public async Task<IActionResult> UpdateProduct(int id, [FromBody] Product product)
    {
        await _adminService.UpdateProductAsync(id, product);
        return Ok("Продукт обновлен успешно.");
    }
    
    [HttpDelete("product/{id}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
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