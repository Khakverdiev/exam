using System.Security.Claims;
using AuthAndProductData.DTOs;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using UserService.Exceptions;
using UserService.Interfaces;
using UserService.Validators;

namespace AuthApiService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly LoginUserValidator loginValidator;
    private readonly RegisterUserValidator registerValidator;
    private readonly IAuthService authService;
    private readonly IAdminRequestService _adminRequestService;
    private readonly ITokenService _tokenService;

    public AuthController(LoginUserValidator loginValidator, RegisterUserValidator registerValidator,
        IAuthService authService, IAdminRequestService adminRequestService, ITokenService tokenService)
    {
        this.loginValidator = loginValidator;
        this.registerValidator = registerValidator;
        this.authService = authService;
        _adminRequestService = adminRequestService;
        _tokenService = tokenService;
    }
    
    [AllowAnonymous]
    [HttpPost("Login")]
    public async Task<IActionResult> LoginAsync([FromBody] LoginDto user)
    {
        try
        {
            var validationResult = loginValidator.Validate(user);

            if (!validationResult.IsValid)
            {
                return BadRequest(new { Errors = validationResult.Errors.Select(e => e.ErrorMessage) });
            }
            
            Console.WriteLine($"Attempting login for: {user.Username}");

            var res = await authService.LoginUserAsync(user);

            return Ok(res);
        }
        catch (MyAuthException ex)
        {
            Console.WriteLine($"Auth error: {ex.Message}");
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Unexpected error: {ex.Message}");
            return StatusCode(500, new { error = "An unexpected error occurred." });
        }
    }
    
    [AllowAnonymous]
    [HttpPost("Register")]
    public async Task<IActionResult> RegisterAsync([FromBody] RegisterDto user)
    {
        
        if (user == null)
        {
            return BadRequest("User data is missing.");
        }
        
        var validationResult = registerValidator.Validate(user);
        if (!validationResult.IsValid)
        {
            return BadRequest(validationResult.Errors);
        }

        try
        {
            var res = await authService.RegisterUserAsync(user);
        
            return Ok(new PostResponseDto("Registration completed"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }
    
    [Authorize]
    [HttpPost("Refresh")]
    public async Task<IActionResult> RefreshTokenAsync(TokenDto refresh)
    {
        var newToken = await authService.RefreshTokenAsync(refresh);

        if (newToken is null)
            return BadRequest("Invalid token");

        var principal = _tokenService.GetPrincipalFromToken(refresh.AccessToken, validateLifetime: false);
        var role = principal.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value;
        
        string accessTokenCookieName = role == "AppAdmin" ? "AdminAccessToken" : "UserAccessToken";
        string refreshTokenCookieName = role == "AppAdmin" ? "AdminRefreshToken" : "UserRefreshToken";

        HttpContext.Response.Cookies.Append(accessTokenCookieName, newToken.accessToken, new CookieOptions
        {
            HttpOnly = false,
            Secure = true,
            Expires = DateTime.UtcNow.AddMinutes(10),
            SameSite = SameSiteMode.None
        });

        HttpContext.Response.Cookies.Append(refreshTokenCookieName, newToken.refreshToken, new CookieOptions
        {
            HttpOnly = false,
            Secure = true,
            Expires = newToken.refreshTokenExpireTime,
            SameSite = SameSiteMode.None
        });

        return Ok(newToken);
    }
    
    [Authorize]
    [HttpPost("Logout")]
    public async Task<IActionResult> LogoutAsync(TokenDto logout)
    {
        await authService.LogOutAsync(logout);

        HttpContext.Response.Cookies.Delete("UserAccessToken");
        HttpContext.Response.Cookies.Delete("UserRefreshToken");
        HttpContext.Response.Cookies.Delete("AdminAccessToken");
        HttpContext.Response.Cookies.Delete("AdminRefreshToken");
        
        HttpContext.User = null;

        return Ok("Logged out successfully");
    }
}