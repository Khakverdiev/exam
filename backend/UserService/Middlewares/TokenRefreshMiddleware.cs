using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Text;
using AuthAndProductData.Contexts;
using AuthAndProductData.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using UserService.Interfaces;

namespace UserService.Middlewares;

public class TokenRefreshMiddleware : IMiddleware
{
    private readonly ITokenService _tokenService;
    private readonly AuthContext _context;
    private readonly IConfiguration _config;
    private readonly ILogger<TokenRefreshMiddleware> _logger;

    public TokenRefreshMiddleware(ITokenService tokenService, AuthContext context, IConfiguration config, ILogger<TokenRefreshMiddleware> logger)
    {
        _tokenService = tokenService;
        _context = context;
        _config = config;
        _logger = logger;
    }
    
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        var accessToken = context.Request.Cookies["AdminAccessToken"] ?? context.Request.Cookies["UserAccessToken"];
        var refreshToken = context.Request.Cookies["AdminRefreshToken"] ?? context.Request.Cookies["UserRefreshToken"];
        
        if (string.IsNullOrEmpty(accessToken) && string.IsNullOrEmpty(refreshToken))
        {
            await next(context);
            return;
        }
        
        if (!string.IsNullOrEmpty(accessToken) && !IsAccessTokenNearExpiry(accessToken, 2))
        {
            await next(context);
            return;
        }
        
        try
        {
            if (!string.IsNullOrEmpty(refreshToken))
            {
                var user = await ValidateRefreshTokenAsync(refreshToken);
                if (user != null)
                {
                    await UpdateTokensAsync(context, user);
                    await next(context);
                    return;
                }

                ClearCookies(context);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка обновления токенов");
            context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
            await context.Response.WriteAsync("Unauthorized");
            return;
        }

        context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
        await context.Response.WriteAsync("Unauthorized");
    }
    
    private async Task<User> ValidateRefreshTokenAsync(string refreshToken)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.RefreshToken == refreshToken);
        if (user == null || user.RefreshTokenExpiryTime < DateTime.UtcNow)
        {
            return null;
        }

        return user;
    }
    
    private bool IsAccessTokenNearExpiry(string accessToken, int minutesBeforeExpiry)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var jwtToken = tokenHandler.ReadJwtToken(accessToken);
        var expirationDate = jwtToken.ValidTo;

        return expirationDate <= DateTime.UtcNow.AddMinutes(minutesBeforeExpiry);
    }
    
    private async Task UpdateTokensAsync(HttpContext context, User user)
    {
        var newAccessToken = await _tokenService.GenerateTokenAsync(user);

        var role = (await _context.UserRoles
            .Include(r => r.AppRole)
            .FirstOrDefaultAsync(r => r.UserId == user.Id))?.AppRole.Name;

        var accessTokenCookieName = role == "AppAdmin" ? "AdminAccessToken" : "UserAccessToken";
        var refreshTokenCookieName = role == "AppAdmin" ? "AdminRefreshToken" : "UserRefreshToken";

        SetAccessTokenCookie(context, newAccessToken, accessTokenCookieName);

        if (user.RefreshTokenExpiryTime < DateTime.UtcNow.AddDays(10))
        {
            user.RefreshToken = await _tokenService.GenerateRefreshTokenAsync();
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(30);
            await _context.SaveChangesAsync();

            SetRefreshTokenCookie(context, user.RefreshToken, user.RefreshTokenExpiryTime, refreshTokenCookieName);
        }
    }

    private void SetAccessTokenCookie(HttpContext context, string accessToken, string cookieName)
    {
        int accessTokenExpiryMinutes = int.Parse(_config["Jwt:AccessTokenExpiryMinutes"]);

        context.Response.Cookies.Append(cookieName, accessToken, new CookieOptions
        {
            HttpOnly = false,
            Secure = true,
            Expires = DateTime.UtcNow.AddMinutes(accessTokenExpiryMinutes),
            SameSite = SameSiteMode.None
        });
    }

    private void SetRefreshTokenCookie(HttpContext context, string refreshToken, DateTime expiryTime, string cookieName)
    {
        context.Response.Cookies.Append(cookieName, refreshToken, new CookieOptions
        {
            HttpOnly = false,
            Secure = true,
            Expires = expiryTime,
            SameSite = SameSiteMode.None
        });
    }
    
    private void ClearCookies(HttpContext context)
    {
        context.Response.Cookies.Delete("AdminAccessToken");
        context.Response.Cookies.Delete("UserAccessToken");
        context.Response.Cookies.Delete("AdminRefreshToken");
        context.Response.Cookies.Delete("UserRefreshToken");
    }
}
