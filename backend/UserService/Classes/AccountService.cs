using System.Security.Claims;
using AuthAndProductData.Contexts;
using AuthAndProductData.DTOs;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.EntityFrameworkCore;
using UserService.Exceptions;
using UserService.Interfaces;
using static BCrypt.Net.BCrypt;

namespace UserService.Classes;

public class AccountService : IAccountService
{
    private readonly IEmailSender emailSender;
    private readonly ITokenService tokenService;
    private readonly AuthContext context;

    public AccountService(IEmailSender emailSender, ITokenService tokenService, AuthContext context)
    {
        this.emailSender = emailSender;
        this.tokenService = tokenService;
        this.context = context;
    }
    
    public async Task ConfirmEmailAsync(string token)
    {
        var principal = tokenService.GetPrincipalFromToken(token, validateLifetime: true);

        var username = principal.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

        var user = context.Users.FirstOrDefault(u => u.Username == username);

        if (user == null)
        {
            throw new MyAuthException(AuthErrorTypes.UserNotFound, "User not found");
        }

        var confirmationToken = await tokenService.GenerateEmailTokenAsync(user.Id.ToString());

        var link = $"https://localhost:7059/api/Account/ValidateConfirmation?token={confirmationToken}&userId={user.Id}";

        string message = $"Please confirm your account by <a href='{link}'>clicking here</a>;.";
        await emailSender.SendEmailAsync(user.Email, "Email confirmation", message);
    }
    
    public async Task ResetPasswordAsync(ResetPasswordDto resetRequest, string token)
    {
        var principal = tokenService.GetPrincipalFromToken(token, validateLifetime: true);

        var username = principal.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

        var user = await context.Users.FirstOrDefaultAsync(u => u.Username == username);

        if (user == null)
        {
            throw new MyAuthException(AuthErrorTypes.UserNotFound, "User not found");
        }

        if (!Verify(resetRequest.OldPassword, user.Password))
        {
            throw new MyAuthException(AuthErrorTypes.InvalidCredentials, "Invalid credentials");
        }

        if (resetRequest.NewPassword != resetRequest.ConfirmNewPassword)
        {
            throw new MyAuthException(AuthErrorTypes.PasswordMismatch, "Passwords do not match");
        }
        
        user.Password = HashPassword(resetRequest.NewPassword);

        await emailSender.SendEmailAsync(user.Email, "Password Reset", "Your password has been reset");

        await context.SaveChangesAsync();
    }
    
    public async Task ForgotPasswordAsync(string email)
    {
        var user = await context.Users.FirstOrDefaultAsync(u => u.Email == email);

        if (user == null)
        {
            throw new MyAuthException(AuthErrorTypes.UserNotFound, "User not found");
        }

        var resetToken = await tokenService.GeneratePasswordResetTokenAsync(user.Username);

        var resetLink = $"https://localhost:3000/new-password?token={resetToken}&username={user.Username}";
        string message = $"To reset your password, click the link: <a href='{resetLink}'>Reset Password</a>";

        await emailSender.SendEmailAsync(user.Email, "Password Reset", message);
    }

    public async Task ResetPasswordWithoutOldPasswordAsync(ResetPasswordWithoutOldPasswordDto resetRequest)
    {
        var principal = tokenService.GetPrincipalFromToken(resetRequest.Token, validateLifetime: true);
        var tokenUsername = principal.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

        if (tokenUsername != resetRequest.Username)
        {
            throw new MyAuthException(AuthErrorTypes.InvalidToken, "Invalid token or username mismatch");
        }

        var user = await context.Users.FirstOrDefaultAsync(u => u.Username == resetRequest.Username);
        if (user == null)
        {
            throw new MyAuthException(AuthErrorTypes.UserNotFound, "User not found");
        }

        if (resetRequest.NewPassword != resetRequest.ConfirmNewPassword)
        {
            throw new MyAuthException(AuthErrorTypes.PasswordMismatch, "Passwords do not match");
        }

        user.Password = BCrypt.Net.BCrypt.HashPassword(resetRequest.NewPassword);

        await context.SaveChangesAsync();
    }
}