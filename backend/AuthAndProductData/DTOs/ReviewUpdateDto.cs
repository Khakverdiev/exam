namespace AuthAndProductData.DTOs;

public record ReviewUpdateDto(
    int Id,
    string ReviewText,
    int Rating
);