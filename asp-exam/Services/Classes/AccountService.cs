using System.Security.Claims;
using System.Text.RegularExpressions;
using aspnetexam.Data.Contexts;
using aspnetexam.Data.Models;
using aspnetexam.Exceptions;
using aspnetexam.Services.Interfaces;
using aspnetexam.Validators;
using Microsoft.EntityFrameworkCore;
using static BCrypt.Net.BCrypt;

namespace aspnetexam.Services.Classes;

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
        var principal = tokenService.GetPrincipalFromExpiredToken(token, validateLifetime: true);

        var username = principal.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

        var user = context.Users.FirstOrDefault(u => u.Id.ToString() == username);

        if (user == null)
        {
            throw new MyAuthException(AuthErrorTypes.UserNotFound, "User not found");
        }

        var confirmationToken = await tokenService.GenerateEmailTokenAsync(user.Id.ToString());

        var link = $"http://localhost:5175/api/v1/Account/ValidateConfirmation?token={confirmationToken}&userId={user.Id}";

        string message = $"Please confirm your account by <a href='{link}'>clicking here</a>;.";
        await emailSender.SendEmailAsync(user.Email, "Email confirmation", message, isHtml: true);
    }

    public async Task ResetPaswordAsync(ResetPassword resetRequest, string token)
    {
        var principal = tokenService.GetPrincipalFromExpiredToken(token, validateLifetime: true);

        var userId = principal.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

        var user = await context.Users.FirstOrDefaultAsync(u => u.Id.ToString() == userId);

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

        if (!Regex.IsMatch(resetRequest.NewPassword, RegexPatterns.passwordPattern))
        {
            throw new MyAuthException(AuthErrorTypes.InvalidPasswordFormat, "Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one digit, and one special character (_*&%$#@).");
        }

        user.Password = HashPassword(resetRequest.NewPassword);

        await emailSender.SendEmailAsync(user.Email, "Password Reset", "Your password has been reset");

        await context.SaveChangesAsync();
    }
}
