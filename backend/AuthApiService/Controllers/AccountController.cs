using AuthAndProductData.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UserService.Interfaces;

namespace AuthApiService.Controllers;

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
    [HttpPost("ResetPassword")]
    public async Task<IActionResult> ResetPasswordAsync([FromBody] ResetPasswordDto resetRequest)
    {
        var token = HttpContext.Request.Headers["Authorization"];

        token = token.ToString().Replace("Bearer ", "");

        await accountService.ResetPasswordAsync(resetRequest, token);
        return Ok("Recovery link sent to your email");
    }
    
    [HttpPost("ResetPasswordWithoutOldPassword")]
    public async Task<IActionResult> ResetPasswordWithoutOldPasswordAsync([FromBody] ResetPasswordWithoutOldPasswordDto resetPasswordRequest)
    {
        await accountService.ResetPasswordWithoutOldPasswordAsync(resetPasswordRequest);
        return Ok("Password has been reset successfully.");
    }
    
    [HttpPost("ForgotPassword")]
    public async Task<IActionResult> ForgotPasswordAsync([FromBody] ForgotPasswordDto forgotPasswordRequest)
    {
        await accountService.ForgotPasswordAsync(forgotPasswordRequest.Email);
        return Ok("Password reset link has been sent to your email.");
    }
    
    [Authorize]
    [HttpPost("confirmemail")]
    public async Task<IActionResult> ConfirmEmailAsync()
    {
        var token = HttpContext.Request.Headers["Authorization"];
        token = token.ToString().Replace("Bearer ", "");

        await accountService.ConfirmEmailAsync(token);

        return Ok(new { message = "Confirmation email sent. Please check your inbox." });
    }
    
    [HttpGet("ValidateConfirmation")]
    public async Task<IActionResult> ValidateConfirmationAsync([FromQuery] string token, [FromQuery] string userId)
    {
        await tokenService.ValidateEmailTokenAsync(token, userId);

        return Ok("Email confirmed successfully");
    }
}