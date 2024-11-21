using System.Security.Claims;
using AuthAndProductData.Models;

namespace UserService.Interfaces;

public interface ITokenService
{
    public Task<string> GenerateTokenAsync(User user);
    public Task<string> GenerateRefreshTokenAsync();
    public ClaimsPrincipal GetPrincipalFromToken(string token, bool validateLifetime = false);
    public Task<string> GenerateEmailTokenAsync(string userId);
    Task<string> GeneratePasswordResetTokenAsync(string userId);
    public Task ValidateEmailTokenAsync(string token, string userId);
}