namespace AuthAndProductData.DTOs;

public record TokenDto(
    string AccessToken,
    string RefreshToken
);