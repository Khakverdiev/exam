using System.Security.Claims;
using aspnetexam.Data.Contexts;
using aspnetexam.Data.Models;
using aspnetexam.Data.Models.DTOs;
using aspnetexam.Exceptions;
using aspnetexam.Middlewares;
using aspnetexam.Services.Interfaces;
using aspnetexam.Validators;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace aspnetexam.Controllers;


[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly LoginUserValidator loginValidator;
    private readonly RegisterUserValidator registerValidator;
    private readonly IAuthService authService;
    private readonly AuthContext context;
    private readonly IEmailSender emailSender;

    public AuthController(AuthContext context, LoginUserValidator loginValidator, RegisterUserValidator registerValidator, IAuthService authService, IEmailSender emailSender)
    {
        this.context = context;
        this.loginValidator = loginValidator;
        this.registerValidator = registerValidator;
        this.authService = authService;
        this.emailSender = emailSender;
    }

    [HttpPost("Login")]
    public async Task<IActionResult> LoginAsync([FromBody] LoginUser user)
    {
        var validationResult = loginValidator.Validate(user);

        if (!validationResult.IsValid)
        {
            return BadRequest(validationResult.Errors);
        }

        try
        {
            var res = await authService.LoginUserAsync(user);
            
            HttpContext.Response.Cookies.Append("AccessToken", res.AccessToken, new CookieOptions
            {
                HttpOnly = false,
                Secure = true,
                Expires = DateTime.UtcNow.AddMinutes(10),
                SameSite = SameSiteMode.None
            });
            
            HttpContext.Response.Cookies.Append("RefreshToken", res.RefreshToken, new CookieOptions
            {
                HttpOnly = false,
                Secure = true,
                Expires = res.RefreshTokenExpireTime,
                SameSite = SameSiteMode.None
            });
            
            HttpContext.Response.Cookies.Append("UserId", res.UserId.ToString(), new CookieOptions
            {
                HttpOnly = false,
                Secure = true,
                Expires = DateTime.UtcNow.AddDays(1),
                SameSite = SameSiteMode.None
            });

            HttpContext.Response.Cookies.Append("Username", res.Username, new CookieOptions
            {
                HttpOnly = false,
                Secure = true,
                Expires = DateTime.UtcNow.AddDays(1),
                SameSite = SameSiteMode.None
            });
            
            HttpContext.Response.Cookies.Append("Role", res.Role, new CookieOptions
            {
                HttpOnly = false,
                Secure = true,
                Expires = DateTime.UtcNow.AddDays(1),
                SameSite = SameSiteMode.None
            });

            return Ok(new
            {
                res.UserId,
                res.Username,
                res.AccessToken,
                res.RefreshToken,
                res.RefreshTokenExpireTime,
                res.Role
            });
        }
        catch (MyAuthException ex)
        {
            return BadRequest($"{ex.Message}\n{ex.AuthErrorType}");
        }
    }

    [HttpPost("Register")]
    public async Task<IActionResult> RegisterAsync([FromBody] RegisterUser user)
    {
        var validationResult = registerValidator.Validate(user);
        if (!validationResult.IsValid)
        {
            return BadRequest(validationResult.Errors);
        }

        try
        {
            var res = await authService.RegisterUserAsync(user);

            var confirmationToken = Guid.NewGuid().ToString();

            context.Users.Update(res);
            await context.SaveChangesAsync();

            var userProfile = new UserProfile
            {
                UserId = res.Id,
                FirstName = null,
                LastName = null,
                PhoneNumber = null,
                Address = null,
                City = null,
                Country = null,
                PostalCode = null
            };

            context.UserProfiles.Add(userProfile);
            await context.SaveChangesAsync();

            return Ok(res);
        }
        catch (MyAuthException ex)
        {
            return BadRequest($"{ex.Message}\n{ex.AuthErrorType}");
        }
    }


    [HttpPost("Refresh")]
    public async Task<IActionResult> RefreshTokenAsync([FromBody] TokenData refresh)
    {
        var refreshToken = refresh.RefreshToken; 

        if (string.IsNullOrEmpty(refreshToken))
        {
            return Unauthorized("Refresh token is missing");
        }

        try
        {
            var newAccessInfo = await authService.RefreshTokenAsync(new TokenData { RefreshToken = refreshToken });

            HttpContext.Response.Cookies.Append("AccessToken", newAccessInfo.AccessToken, new CookieOptions
            {
                HttpOnly = false,
                Secure = true,
                Expires = DateTime.UtcNow.AddMinutes(10),
                SameSite = SameSiteMode.None
            });

            HttpContext.Response.Cookies.Append("RefreshToken", newAccessInfo.RefreshToken, new CookieOptions
            {
                HttpOnly = false,
                Secure = true,
                Expires = DateTime.UtcNow.AddDays(30),
                SameSite = SameSiteMode.None
            });

            return Ok(newAccessInfo);
        }
        catch (MyAuthException ex)
        {
            return BadRequest($"{ex.Message}\n{ex.AuthErrorType}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error during token refresh: {ex.Message}");
            return StatusCode(500, "An unexpected error occurred. Please try again later.");
        }
    }

    [Authorize]
    [HttpPost("Logout")]
    public async Task<IActionResult> LogoutAsync(TokenData logout)
    {
        try
        {
            await authService.LogOutAsync(logout);

            TokenRefreshMiddleware.refreshTokenCleared = false;

            HttpContext.Response.Cookies.Delete("AccessToken");
            HttpContext.Response.Cookies.Delete("RefreshToken");
            HttpContext.Response.Cookies.Delete("Username");
            HttpContext.Response.Cookies.Delete("UserId");
            HttpContext.Response.Cookies.Delete("Role");

            return Ok("Logged out successfully");
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}
