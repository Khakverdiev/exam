namespace AuthAndProductData.DTOs;

public record ReviewCreateDto(
    string Username,
    int ProductId,
    string ReviewText,
    int Rating
);