namespace AuthAndProductData.DTOs;

public record AccessInfoDto(
    string accessToken,
    string refreshToken,
    DateTime refreshTokenExpireTime,
    string role
);