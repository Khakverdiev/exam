using aspnetexam.Data.Contexts;
using aspnetexam.Data.Models;
using aspnetexam.Data.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace aspnetexam.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReviewController : Controller
{
    private readonly AuthContext _context;

    public ReviewController(AuthContext context)
    {
        _context = context;
    }

    [HttpGet("product/{productId}")]
    [Authorize(Roles = "appuser, appadmin")]
    public async Task<IActionResult> GetReviewsByProduct(int productId)
    {
        var reviews = await _context.Reviews
            .Where(r => r.ProductId == productId)
            .Include(r => r.User)
            .ToListAsync();

        if (reviews == null || !reviews.Any())
        {
            return NotFound("Отзывы для этого продукта не найдены.");
        }

        var reviewDtos = reviews.Select(r => new ReviewDto
        {
            Id = r.Id,
            UserId = r.UserId,
            Username = r.User.Username,
            ProductId = r.ProductId,
            ReviewText = r.ReviewText,
            Rating = r.Rating,
            CreatedAt = r.CreatedAt
        });

        return Ok(reviewDtos);
    }

    [HttpPost]
    [Authorize(Roles = "appuser, appadmin")]
    public async Task<ActionResult<ReviewDto>> CreateReview([FromBody] Review review)
    {
        if (review == null)
        {
            return BadRequest("Review cannot be null.");
        }

        if (!await _context.Users.AnyAsync(u => u.Id == review.UserId) ||
            !await _context.Products.AnyAsync(p => p.Id == review.ProductId))
        {
            return NotFound("User or Product not found.");
        }

        _context.Reviews.Add(review);
        await _context.SaveChangesAsync();

        var reviewDto = new ReviewDto
        {
            Id = review.Id,
            UserId = review.UserId,
            Username = (await _context.Users.FindAsync(review.UserId))?.Username,
            ProductId = review.ProductId,
            ReviewText = review.ReviewText,
            Rating = review.Rating,
            CreatedAt = review.CreatedAt
        };

        return CreatedAtAction(nameof(GetReviewById), new { id = review.Id }, reviewDto);
    }

    [HttpGet("{id}")]
    [Authorize(Roles = "appuser, appadmin")]
    public async Task<IActionResult> GetReviewById(int id)
    {
        var review = await _context.Reviews
            .Include(r => r.User)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (review == null)
        {
            return NotFound("Отзыв не найден.");
        }

        // Map to ReviewDto
        var reviewDto = new ReviewDto
        {
            Id = review.Id,
            UserId = review.UserId,
            Username = review.User.Username,
            ProductId = review.ProductId,
            ReviewText = review.ReviewText,
            Rating = review.Rating,
            CreatedAt = review.CreatedAt
        };

        return Ok(reviewDto);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "appuser, appadmin")]
    public async Task<IActionResult> DeleteReview(int id)
    {
        var review = await _context.Reviews.FindAsync(id);
        if (review == null)
        {
            return NotFound("Отзыв не найден.");
        }

        _context.Reviews.Remove(review);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
