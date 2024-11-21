using AuthAndProductData.DTOs;

namespace UserService.Interfaces;

public interface IAccountService
{
    public Task ResetPasswordAsync(ResetPasswordDto resetRequest, string token);
    public Task ConfirmEmailAsync(string token);
    public Task ForgotPasswordAsync(string email);
    public Task ResetPasswordWithoutOldPasswordAsync(ResetPasswordWithoutOldPasswordDto resetRequest);
}