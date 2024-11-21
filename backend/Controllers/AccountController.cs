using System.Security.Claims;
using aspnetexam.Data.Models;
using aspnetexam.Exceptions;
using aspnetexam.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace aspnetexam.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AccountController : ControllerBase
{
    private readonly IAccountService accountService;
    private readonly ITokenService tokenService;

    public AccountController(IAccountService accountService, ITokenService tokenService)
    {
        this.accountService = accountService;
        this.tokenService = tokenService;
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
            var token = HttpContext.Request.Headers["Authorization"];

            token = token.ToString().Replace("Bearer ", "");

            var userIdClaim = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null)
            {
                return BadRequest("User ID not found in token.");
            }

            var userId = userIdClaim.Value;

            var confirmationToken = tokenService.GenerateEmailTokenAsync(userId);

            await accountService.ConfirmEmailAsync(token);

            return Ok(new { Token = confirmationToken });
        }
        catch
        {
            throw;
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
