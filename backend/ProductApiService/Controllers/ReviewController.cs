using AuthAndProductData.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProductService.Interfaces;

namespace ProductApiService.Controllers;

[Authorize]
[ApiController]
[Route("api/reviews")]
public class ReviewController : ControllerBase
{
   private readonly IReviewService _reviewService;

    public ReviewController(IReviewService reviewService)
    {
        _reviewService = reviewService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllReviews()
    {
        var reviews = await _reviewService.GetAllReviewsAsync();
        return Ok(reviews);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetReviewById(int id)
    {
        var review = await _reviewService.GetReviewByIdAsync(id);
        if (review == null)
            return NotFound("Review not found.");

        return Ok(review);
    }

    [HttpGet("product/{productId}")]
    public async Task<IActionResult> GetReviewsByProductId(int productId)
    {
        var reviews = await _reviewService.GetReviewsByProductIdAsync(productId);
        return Ok(reviews);
    }

    [HttpGet("user/{username}")]
    [Authorize]
    public async Task<IActionResult> GetReviewsByUsername(string username)
    {
        var reviews = await _reviewService.GetReviewsByUsernameAsync(username);
        return Ok(reviews);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreateReview([FromBody] ReviewCreateDto reviewCreateDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var createdReview = await _reviewService.CreateReviewAsync(reviewCreateDto);
        return CreatedAtAction(nameof(GetReviewById), new { id = createdReview.Id }, createdReview);
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> UpdateReview(int id, [FromBody] ReviewUpdateDto reviewUpdateDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var updatedReview = await _reviewService.UpdateReviewAsync(id, reviewUpdateDto);
        if (updatedReview == null)
            return NotFound("Review not found.");

        return Ok(updatedReview);
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteReview(int id)
    {
        await _reviewService.DeleteReviewAsync(id);
        return NoContent();
    }
}