using aspnetexam.Data.Models;

namespace aspnetexam.Services.Interfaces;

public interface IAccountService
{
    public Task ResetPaswordAsync(ResetPassword resetRequest, string token);
    public Task ConfirmEmailAsync(string token);
}
