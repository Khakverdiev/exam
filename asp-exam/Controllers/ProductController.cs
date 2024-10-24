using System.Net.Mime;
using aspnetexam.Data.Contexts;
using aspnetexam.Data.Models;
using aspnetexam.Data.Models.DTOs;
using aspnetexam.Services.Interfaces;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Jpeg;

namespace aspnetexam.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductController : Controller
{
    private readonly AuthContext context;
    private readonly IBlobService _blobService;

    public ProductController(AuthContext context, IBlobService blobService)
    {
        this.context = context;
        _blobService = blobService;
    }

    [HttpGet("GetProducts")]
    [Authorize(Roles = "appuser, appadmin")]
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetProducts()
    {
        try
        {
            var products = await context.Products.ToListAsync();
        
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

    [HttpPost("AddProducts")]
    [Authorize(Roles = "appadmin")]
    public async Task<ActionResult<Product>> AddProduct([FromForm] ProductCreateDto productDto)
    {
        if (productDto == null)
        {
            return BadRequest("Product data is required.");
        }

        string imageUrl = null;
        if (productDto.ImageFile != null)
        {
            imageUrl = await _blobService.UploadFileAsync(productDto.ImageFile);
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

        context.Products.Add(product);
        await context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetProductById), new { id = product.Id }, product);
    }

    [HttpGet("{id}")]
    [Authorize(Roles = "appuser, appadmin")]
    public async Task<ActionResult<Product>> GetProductById(int id)
    {
        var product = await context.Products.FindAsync(id);

        if (product == null)
        {
            return NotFound();
        }

        return product;
    }
    
    [HttpDelete("DeleteProduct/{id}")]
    [Authorize(Roles = "appadmin")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var product = await context.Products.FindAsync(id);
        if (product == null)
        {
            return NotFound("Продукт не найден.");
        }

        if (!string.IsNullOrEmpty(product.ImageUrl))
        {
            var imageName = Path.GetFileName(new Uri(product.ImageUrl).AbsolutePath);
            var isDeleted = await _blobService.DeleteFileAsync(imageName);
            if (!isDeleted)
            {
                return StatusCode(500, "Ошибка при удалении изображения из Blob Storage.");
            }
        }

        context.Products.Remove(product);
        await context.SaveChangesAsync();

        return Ok("Продукт и связанное изображение успешно удалены.");
    }
}
