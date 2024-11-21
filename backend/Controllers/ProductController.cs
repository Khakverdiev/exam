using aspnetexam.Data.Contexts;
using aspnetexam.Data.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace aspnetexam.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductController : Controller
{
    private readonly AuthContext context;

    public ProductController(AuthContext context)
    {
        this.context = context;
    }

    [HttpGet("GetProducts")]
    [Authorize(Roles = "appuser, appadmin")]
    public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
    {
        return await context.Products.ToListAsync();
    }

    [HttpPost("AddProducts")]
    [Authorize(Roles = "appuser, appadmin")]
    public async Task<ActionResult<Product>> AddProduct(Product product)
    {
        if (product == null)
        {
            return BadRequest("Product data is required.");
        }

        context.Products.Add(product);
        await context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetProductById), new { id = product.Id }, product);
    }

    [HttpGet("{id}")]
    [Authorize(Roles = "appadmin")]
    public async Task<ActionResult<Product>> GetProductById(int id)
    {
        var product = await context.Products.FindAsync(id);

        if (product == null)
        {
            return NotFound();
        }

        return product;
    }
}
