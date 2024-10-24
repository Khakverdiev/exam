using System.Security.Claims;
using aspnetexam.Data.Contexts;
using aspnetexam.Data.Models;
using aspnetexam.Exceptions;
using aspnetexam.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace aspnetexam.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AccountController : ControllerBase
{
    private readonly IAccountService accountService;
    private readonly ITokenService tokenService;
    private readonly AuthContext _context;

    public AccountController(IAccountService accountService, ITokenService tokenService, AuthContext context)
    {
        this.accountService = accountService;
        this.tokenService = tokenService;
        _context = context;
    }

    [Authorize]
    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPasswordAsync([FromBody] ResetPassword resetRequest)
    {
        try
        {
            var token = HttpContext.Request.Headers["Authorization"];

            token = token.ToString().Replace("Bearer ", "");

            await accountService.ResetPaswordAsync(resetRequest, token);
            return Ok("Recovery link sent to your email");
        }
        catch (MyAuthException ex)
        {
            return BadRequest($"{ex.Message}\n{ex.AuthErrorType}");
        }
    }

    [Authorize]
    [HttpPost("ConfirmEmail")]
    public async Task<IActionResult> ConfirmEmailAsync()
    {
        try
        {
            var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");

            var principal = tokenService.GetPrincipalFromExpiredToken(token, validateLifetime: true);

            var userId = principal.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id.ToString() == userId);
            if (user == null)
            {
                return BadRequest("User not found.");
            }

            if (user.IsEmailConfirmed)
            {
                return BadRequest("Email already confirmed.");
            }

            user.IsEmailConfirmed = true;

            var newAccessToken = await tokenService.GenerateTokenAsync(user);
            var newRefreshToken = await tokenService.GenerateRefreshTokenAsync();

            user.RefreshToken = newRefreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(30);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken,
                UserId = user.Id,
                Username = user.Username,
                Role = user.Role,
                RefreshTokenExpireTime = user.RefreshTokenExpiryTime
            });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error confirming email: {ex.Message}");
            return StatusCode(500, "An error occurred during email confirmation.");
        }
    }

    [HttpGet("ValidateConfirmation")]
    public async Task<IActionResult> ValidateConfirmationAsync([FromQuery] string token)
    {
        try
        {
            await tokenService.ValidateEmailTokenAsync(token);

            return Ok("Email confirmed successfully");
        }
        catch
        {
            throw;
        }
    }
}
