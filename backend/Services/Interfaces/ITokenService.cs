using System.Security.Claims;
using aspnetexam.Data.Models;

namespace aspnetexam.Services.Interfaces;

public interface ITokenService
{
    public Task<string> GenerateTokenAsync(User user);
    public Task<string> GenerateRefreshTokenAsync();
    ClaimsPrincipal GetPrincipalFromExpiredToken(string token, bool validateLifetime = false);
    public Task<string> GenerateEmailTokenAsync(string userId);
    public Task ValidateEmailTokenAsync(string token);
}
