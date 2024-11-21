namespace AuthAndProductData.DTOs;

public record ReviewDto(
    int Id,
    string Username,
    int ProductId,
    string ProductName,
    string ProductImageUrl, 
    string ReviewText,
    int Rating,
    DateTime CreatedAt
);