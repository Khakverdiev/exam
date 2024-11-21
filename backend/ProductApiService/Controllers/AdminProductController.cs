using AuthAndProductData.Contexts;
using AuthAndProductData.DTOs;
using AuthAndProductData.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProductService.Interfaces;

namespace ProductApiService.Controllers;

[Authorize(Policy = "AdminPolicy")]
[ApiController]
[Route("api/admin/products")]
public class AdminProductController : ControllerBase
{
    private readonly IProductService _productService;
    private readonly AuthContext _context;
    private readonly IBlobService _blobService;

    public AdminProductController(IProductService productService, IBlobService blobService, AuthContext context)
    {
        _productService = productService;
        _blobService = blobService;
        _context = context;
    }
    
    [HttpGet]
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
            return NotFound();

        return Ok(product);
    }
    
    [HttpPost]
    public async Task<ActionResult<ProductDto>> CreateProduct([FromForm] ProductCreateDto productCreateDto)
    {
        if (productCreateDto == null || productCreateDto.ImageFile == null)
        {
            return BadRequest("Необходимо указать данные продукта и изображение.");
        }

        string imageUrl = await _blobService.UploadFileAsync(productCreateDto.ImageFile);

        var product = new Product
        {
            Name = productCreateDto.Name,
            Description = productCreateDto.Description,
            Price = productCreateDto.Price,
            Quantity = productCreateDto.Quantity,
            Category = productCreateDto.Category,
            ImageUrl = imageUrl,
            Sizes = productCreateDto.Sizes.Select(size => new ProductSize{Size = size}).ToList(),
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetProductById), new { id = product.Id }, product);
    }
    
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProduct(int id, [FromBody] ProductUpdateDto productUpdateDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new
            {
                Message = "Validation errors occurred.",
                Errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList()
            });
        }

        try
        {
            var updatedProduct = await _productService.UpdateProductAsync(id, productUpdateDto);
            if (updatedProduct == null)
                return NotFound("Product not found.");

            return Ok(updatedProduct);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return StatusCode(500, "An error occurred while updating the product.");
        }
    }
    
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        await _productService.DeleteProductAsync(id);
        return NoContent();
    }
}