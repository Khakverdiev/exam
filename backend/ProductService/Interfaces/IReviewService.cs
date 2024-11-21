using AuthAndProductData.DTOs;

namespace ProductService.Interfaces;

public interface IReviewService
{
    Task<IEnumerable<ReviewDto>> GetAllReviewsAsync();
    Task<ReviewDto> GetReviewByIdAsync(int reviewId);
    Task<IEnumerable<ReviewDto>> GetReviewsByProductIdAsync(int productId);
    Task<IEnumerable<ReviewDto>> GetReviewsByUsernameAsync(string username);
    Task<ReviewDto> CreateReviewAsync(ReviewCreateDto reviewCreateDto);
    Task<ReviewDto> UpdateReviewAsync(int reviewId, ReviewUpdateDto reviewUpdateDto);
    Task DeleteReviewAsync(int reviewId);
}