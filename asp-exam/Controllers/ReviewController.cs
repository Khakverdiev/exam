using System.Diagnostics;
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
    private readonly ILogger<ReviewController> _logger;

    public ReviewController(AuthContext context, ILogger<ReviewController> logger)
    {
        _context = context;
        _logger = logger;
    }
    
    [HttpGet]
    [Authorize(Roles = "appuser, appadmin")]
    public async Task<IActionResult> GetAllReviews()
    {
        var reviews = await _context.Reviews
            .Include(r => r.User)
            .Include(r => r.Product)
            .ToListAsync();

        if (reviews == null || !reviews.Any())
        {
            return NotFound("Отзывы не найдены.");
        }

        var reviewDtos = reviews.Select(r => new ReviewDto
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

        return Ok(reviewDtos);
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
    public async Task<ActionResult<ReviewDto>> CreateReview([FromBody] ReviewCreateDto reviewDto)
    {
        try
        {
            _logger.LogInformation("Поступил запрос на создание отзыва от пользователя {UserId}", reviewDto.UserId);

            if (reviewDto == null)
            {
                _logger.LogWarning("Получен пустой отзыв.");
                return BadRequest("Review cannot be null.");
            }

            var user = await _context.Users.FindAsync(reviewDto.UserId);
            var product = await _context.Products.FindAsync(reviewDto.ProductId);

            if (user == null || product == null)
            {
                _logger.LogWarning("Пользователь или продукт не найдены. UserId: {UserId}, ProductId: {ProductId}", reviewDto.UserId, reviewDto.ProductId);
                return NotFound("User or Product not found.");
            }

            if (!user.IsEmailConfirmed)
            {
                _logger.LogWarning("Пользователь {UserId} не подтвердил email.", user.Id);
                return Forbid("Пожалуйста, подтвердите свою электронную почту, чтобы оставить отзыв.");
            }

            var review = new Review
            {
                UserId = reviewDto.UserId,
                ProductId = reviewDto.ProductId,
                ReviewText = reviewDto.ReviewText,
                Rating = reviewDto.Rating,
                CreatedAt = DateTime.UtcNow
            };

            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Отзыв создан успешно.");

            var reviewResponse = new ReviewDto
            {
                Id = review.Id,
                UserId = review.UserId,
                Username = user.Username,
                ProductId = review.ProductId,
                ProductName = product.Name,
                ProductImageUrl = product.ImageUrl,
                ReviewText = review.ReviewText,
                Rating = review.Rating,
                CreatedAt = review.CreatedAt
            };

            return CreatedAtAction(nameof(GetReviewById), new { id = review.Id }, reviewResponse);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при создании отзыва.");
            return StatusCode(500, "An unexpected error occurred. Please try again later.");
        }
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
    
    [HttpPut("{id}")]
    [Authorize(Roles = "appuser, appadmin")]
    public async Task<IActionResult> UpdateReview(int id, [FromBody] ReviewUpdateDto reviewDto)
    {
        try
        {
            if (reviewDto == null || string.IsNullOrWhiteSpace(reviewDto.ReviewText) || reviewDto.Rating <= 0)
            {
                return BadRequest("Некорректные данные для обновления отзыва.");
            }

            var review = await _context.Reviews.FindAsync(id);
            if (review == null)
            {
                return NotFound("Отзыв не найден.");
            }

            var userIdFromCookie = HttpContext.Request.Cookies["UserId"];
            if (string.IsNullOrEmpty(userIdFromCookie))
            {
                return Unauthorized("Не удалось получить идентификатор пользователя.");
            }
            
            var user = await _context.Users.FindAsync(Guid.Parse(userIdFromCookie));
            if (user == null)
            {
                return Unauthorized("Пользователь не найден.");
            }

            if (!user.IsEmailConfirmed)
            {
                return Forbid("Пожалуйста, подтвердите свою электронную почту, чтобы редактировать отзыв.");
            }

            if (review.UserId.ToString() != userIdFromCookie)
            {
                return Forbid("Вы можете редактировать только свои отзывы.");
            }

            review.ReviewText = reviewDto.ReviewText;
            review.Rating = reviewDto.Rating;

            await _context.SaveChangesAsync();
            return NoContent();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Ошибка при обновлении отзыва: {ex.Message}");
            return StatusCode(500, "Произошла ошибка при обновлении отзыва.");
        }
    }
    
    [HttpGet("user/{userId}")]
    [Authorize(Roles = "appuser, appadmin")]
    public async Task<IActionResult> GetReviewsByUser(Guid userId)
    {
        var reviews = await _context.Reviews
            .Where(r => r.UserId == userId)
            .Include(r => r.Product).Include(review => review.User)
            .ToListAsync();

        if (reviews == null || !reviews.Any())
        {
            return NotFound("Отзывы не найдены.");
        }

        var reviewDtos = reviews.Select(r => new ReviewDto
        {
            Id = r.Id,
            UserId = r.UserId,
            Username = r.User.Username,
            ProductId = r.ProductId,
            ProductName = r.Product?.Name,
            ProductImageUrl = r.Product?.ImageUrl,
            ReviewText = r.ReviewText,
            Rating = r.Rating,
            CreatedAt = r.CreatedAt
        });

        return Ok(reviewDtos);
    }
}
