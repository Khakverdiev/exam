using System.Diagnostics;
using System.Security.Claims;
using aspnetexam.Data.Contexts;
using aspnetexam.Data.Models;
using aspnetexam.Exceptions;
using aspnetexam.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using static BCrypt.Net.BCrypt;

namespace aspnetexam.Services.Classes;

public class AuthService : IAuthService
{
    private readonly AuthContext context;
    private readonly ITokenService tokenService;
    private readonly IBlackListService blackListService;

    public AuthService(AuthContext context, ITokenService tokenService, IBlackListService blackListService)
    {
        this.context = context;
        this.tokenService = tokenService;
        this.blackListService = blackListService;
    }

    public async Task<AccessInfo> LoginUserAsync(LoginUser user)
    {
        try
        {
            var foundUser = await context.Users.FirstOrDefaultAsync(u => u.Username == user.Username);

            if (foundUser == null)
            {
                throw new MyAuthException(AuthErrorTypes.UserNotFound, "User not found");
            }

            if (!Verify(user.Password, foundUser.Password))
            {
                throw new MyAuthException(AuthErrorTypes.InvalidCredentials, "Invalid credentials");
            }

            var tokenData = new AccessInfo()
            {
                UserId = foundUser.Id,
                Username = foundUser.Username,
                AccessToken = await tokenService.GenerateTokenAsync(foundUser),
                RefreshToken = await tokenService.GenerateRefreshTokenAsync(),
                RefreshTokenExpireTime = DateTime.Now.AddDays(1)
            };
            
            foundUser.RefreshToken = tokenData.RefreshToken;
            foundUser.RefreshTokenExpiryTime = tokenData.RefreshTokenExpireTime;

            await context.SaveChangesAsync();

            return tokenData;
        }
        catch
        {
            throw;
        }
    }

    public async Task LogOutAsync(TokenData userTokenInfo)
    {
        if (userTokenInfo is null)
            throw new MyAuthException(AuthErrorTypes.InvalidRequest, "Invalid client request");

        var principal = tokenService.GetPrincipalFromExpiredToken(userTokenInfo.AccessToken);

        var username = principal.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

        var user = context.Users.FirstOrDefault(u => u.Username == username);

        user.RefreshToken = null;
        user.RefreshTokenExpiryTime = DateTime.Now;
        await context.SaveChangesAsync();

        blackListService.AddTokenToBlackList(userTokenInfo.AccessToken);

    }

    public async Task<AccessInfo> RefreshTokenAsync(TokenData userAccessData)
    {
        var user = await context.Users.FirstOrDefaultAsync(u => u.RefreshToken == userAccessData.RefreshToken);

        if (user == null || user.RefreshTokenExpiryTime < DateTime.UtcNow)
        {
            throw new MyAuthException(AuthErrorTypes.InvalidToken, "Refresh token is invalid or expired");
        }

        // Генерируем новые токены
        var newAccessToken = await tokenService.GenerateTokenAsync(user);
        var newRefreshToken = await tokenService.GenerateRefreshTokenAsync();

        // Обновляем refreshToken в базе данных
        user.RefreshToken = newRefreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(30); // Обновляем срок действия refreshToken

        await context.SaveChangesAsync();

        // Возвращаем AccessInfo с новыми токенами
        return new AccessInfo
        {
            UserId = user.Id,
            Username = user.Username,
            AccessToken = newAccessToken,
            RefreshToken = newRefreshToken,
            RefreshTokenExpireTime = user.RefreshTokenExpiryTime
        };
    }

    public async Task<User> RegisterUserAsync(RegisterUser user)
    {
        try
        {
            var newUser = new User
            {
                Username = user.Username,
                Email = user.Email,
                Password = HashPassword(user.Password),
                Role = string.IsNullOrWhiteSpace(user.Role) ? "appuser" : user.Role,
            };

            await context.AddAsync(newUser);
            await context.SaveChangesAsync();

            return newUser;
        }
        catch
        {
            throw;
        }
    }
}
