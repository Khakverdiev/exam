using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProductService.Interfaces;

namespace ProductApiService.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class UserProductController : ControllerBase
{
    private readonly IProductService _productService;

    public UserProductController(IProductService productService)
    {
        _productService = productService;
    }
    
    [HttpGet("all")]
    public async Task<IActionResult> GetAllProducts()
    {
        var products = await _productService.GetAllProductsAsync();
        return Ok(products);
    }
    
    [HttpGet("{id}")]
    public async Task<IActionResult> GetProductById(int id)
    {
        var product = await _productService.GetProductByIdAsync(id);
        if (product == null)
        {
            return NotFound("Product not found.");
        }
        return Ok(product);
    }
}