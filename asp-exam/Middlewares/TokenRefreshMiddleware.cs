using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Text;
using aspnetexam.Data.Contexts;
using aspnetexam.Data.Models;
using aspnetexam.Services.Interfaces;
using Azure;
using Azure.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace aspnetexam.Middlewares;

public class TokenRefreshMiddleware : IMiddleware
{
    private readonly ITokenService _tokenService;
    private readonly AuthContext _context;
    private readonly IConfiguration _config;
    public static bool refreshTokenCleared = false;

    public TokenRefreshMiddleware(ITokenService tokenService, AuthContext context, IConfiguration config)
    {
        _tokenService = tokenService;
        _context = context;
        _config = config;
    }

    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        var accessToken = context.Request.Cookies["AccessToken"];
        var refreshToken = context.Request.Cookies["RefreshToken"];
        var username = context.Request.Cookies["Username"];
        var userId = context.Request.Cookies["UserId"];
        var role = context.Request.Cookies["Role"];

        if (string.IsNullOrEmpty(accessToken) && string.IsNullOrEmpty(refreshToken))
        {
            await next(context);
            return;
        }

        if (!string.IsNullOrEmpty(accessToken) && !IsAccessTokenExpired(accessToken))
        {
            await EnsureInfoCookiesSet(context, accessToken, username, userId, role);
            await next(context);
            return;
        }

        if (!string.IsNullOrEmpty(refreshToken))
        {
            var user = await ValidateRefreshTokenAsync(refreshToken);
            if (user != null)
            {
                var newAccessToken = await _tokenService.GenerateTokenAsync(user);
                SetAccessTokenCookie(context, newAccessToken);
                await EnsureInfoCookiesSet(context, newAccessToken, user.Username, user.Id.ToString(), user.Role);

                if (user.RefreshTokenExpiryTime < DateTime.UtcNow.AddDays(7))
                {
                    user.RefreshToken = await _tokenService.GenerateRefreshTokenAsync();
                    user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(30);
                    await _context.SaveChangesAsync();
                    SetRefreshTokenCookie(context, user.RefreshToken, user.RefreshTokenExpiryTime);
                }

                Console.WriteLine("New AccessToken generated and set.");
                await next(context);
                return;
            }

            if (!refreshTokenCleared)
            {
                context.Response.Cookies.Delete("RefreshToken");
                refreshTokenCleared = true;
                Console.WriteLine($"Invalid refresh token found and cleared: {refreshToken}");
            }
        }

        context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
        await context.Response.WriteAsync("Unauthorized");
    }

    private async Task<User> ValidateRefreshTokenAsync(string refreshToken)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.RefreshToken == refreshToken);
        if (user == null || user.RefreshTokenExpiryTime < DateTime.UtcNow)
        {
            Console.WriteLine(user == null
                ? "User with provided refresh token not found."
                : "Refresh token has expired.");
            return null;
        }

        return user;
    }

    private bool IsAccessTokenExpired(string accessToken)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(_config.GetSection("Jwt:Key").Value);
        var tokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidIssuer = _config.GetSection("Jwt:Issuer").Value,
            ValidAudience = _config.GetSection("Jwt:Audience").Value,
            ValidateLifetime = true
        };

        try
        {
            tokenHandler.ValidateToken(accessToken, tokenValidationParameters, out _);
            Console.WriteLine("AccessToken is valid.");
            return false;
        }
        catch (SecurityTokenExpiredException)
        {
            Console.WriteLine("AccessToken has expired.");
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error validating token: {ex.Message}");
            return true;
        }
    }

    private void SetAccessTokenCookie(HttpContext context, string accessToken)
    {
        context.Response.Cookies.Append("AccessToken", accessToken, new CookieOptions
        {
            HttpOnly = false,
            Secure = true,
            Expires = DateTime.UtcNow.AddMinutes(10),
            SameSite = SameSiteMode.None
        });
    }

    private void SetRefreshTokenCookie(HttpContext context, string refreshToken, DateTime expiryTime)
    {
        context.Response.Cookies.Append("RefreshToken", refreshToken, new CookieOptions
        {
            HttpOnly = false,
            Secure = true,
            Expires = expiryTime,
            SameSite = SameSiteMode.None
        });
    }

    private async Task EnsureInfoCookiesSet(HttpContext context, string accessToken, string username,
        string userId, string role)
    {
        if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(role))
        {
            var principal = _tokenService.GetPrincipalFromExpiredToken(accessToken);
            var newUsername = principal?.FindFirst(ClaimTypes.Name)?.Value;
            var newUserId = principal?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var newRole = principal?.FindFirst(ClaimTypes.Role)?.Value;

            if (!string.IsNullOrEmpty(newUsername) && !string.IsNullOrEmpty(newUserId) && !string.IsNullOrEmpty(newRole))
            {
                context.Response.Cookies.Append("Username", newUsername, new CookieOptions
                {
                    HttpOnly = false,
                    Secure = true,
                    Expires = DateTime.UtcNow.AddDays(30),
                    SameSite = SameSiteMode.None
                });

                context.Response.Cookies.Append("UserId", newUserId, new CookieOptions
                {
                    HttpOnly = false,
                    Secure = true,
                    Expires = DateTime.UtcNow.AddDays(30),
                    SameSite = SameSiteMode.None
                });
                
                context.Response.Cookies.Append("Role", newRole, new CookieOptions
                {
                    HttpOnly = false,
                    Secure = true,
                    Expires = DateTime.UtcNow.AddDays(30),
                    SameSite = SameSiteMode.None
                });

                Console.WriteLine("Username and UserId restored from token.");
            }
        }
    }
}
