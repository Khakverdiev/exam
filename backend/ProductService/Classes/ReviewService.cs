using AuthAndProductData.Contexts;
using AuthAndProductData.DTOs;
using AuthAndProductData.Models;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using ProductService.Interfaces;

namespace ProductService.Classes;

public class ReviewService : IReviewService
{
    private readonly AuthContext _context;
    private readonly IMapper _mapper;

    public ReviewService(AuthContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }
    
    public async Task<IEnumerable<ReviewDto>> GetAllReviewsAsync()
    {
        var reviews = await _context.Reviews
            .Include(r => r.Product)
            .ToListAsync();

        return _mapper.Map<IEnumerable<ReviewDto>>(reviews);
    }

    public async Task<ReviewDto> GetReviewByIdAsync(int reviewId)
    {
        var review = await _context.Reviews.FindAsync(reviewId);
        if (review == null)
            throw new KeyNotFoundException("Review not found");

        return _mapper.Map<ReviewDto>(review);
    }

    public async Task<IEnumerable<ReviewDto>> GetReviewsByProductIdAsync(int productId)
    {
        var reviews = await _context.Reviews
            .Where(r => r.ProductId == productId)
            .Include(r => r.Product)
            .ToListAsync();
        
        return _mapper.Map<IEnumerable<ReviewDto>>(reviews);
    }

    public async Task<IEnumerable<ReviewDto>> GetReviewsByUsernameAsync(string username)
    {
        var reviews = await _context.Reviews
            .Where(r => r.Username == username)
            .ToListAsync();

        return _mapper.Map<IEnumerable<ReviewDto>>(reviews);
    }

    public async Task<ReviewDto> CreateReviewAsync(ReviewCreateDto reviewCreateDto)
    {
        var review = _mapper.Map<Review>(reviewCreateDto);
        _context.Reviews.Add(review);
        await _context.SaveChangesAsync();

        return _mapper.Map<ReviewDto>(review);
    }

    public async Task<ReviewDto> UpdateReviewAsync(int reviewId, ReviewUpdateDto reviewUpdateDto)
    {
        var review = await _context.Reviews.FindAsync(reviewId);
        if (review == null)
            throw new KeyNotFoundException("Review not found");

        _mapper.Map(reviewUpdateDto, review);
        await _context.SaveChangesAsync();

        return _mapper.Map<ReviewDto>(review);
    }

    public async Task DeleteReviewAsync(int reviewId)
    {
        var review = await _context.Reviews.FindAsync(reviewId);
        if (review == null)
            throw new KeyNotFoundException("Review not found");

        _context.Reviews.Remove(review);
        await _context.SaveChangesAsync();
    }
}