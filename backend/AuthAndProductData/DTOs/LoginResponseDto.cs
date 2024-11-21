namespace AuthAndProductData.DTOs;

public record LoginResponseDto(string username, string role, string accessToken, string refreshToken);