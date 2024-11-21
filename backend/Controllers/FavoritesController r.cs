using aspnetexam.Data.Contexts;
using aspnetexam.Data.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace aspnetexam.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FavoritesController : Controller
{
    private readonly AuthContext _context;

    public FavoritesController(AuthContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> AddToFavorites([FromBody] FavoriteProduct favoriteProduct)
    {
        _context.FavoriteProducts.Add(favoriteProduct);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetFavoritesByUser), new { userId = favoriteProduct.UserId }, favoriteProduct);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> RemoveFromFavorites(int id)
    {
        var favorite = await _context.FavoriteProducts.FindAsync(id);
        if (favorite == null)
        {
            return NotFound("Favorite product not found.");
        }

        _context.FavoriteProducts.Remove(favorite);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetFavoritesByUser(Guid userId)
    {
        var favorites = await _context.FavoriteProducts
            .Where(f => f.UserId == userId)
            .ToListAsync();

        return Ok(favorites);
    }
}
