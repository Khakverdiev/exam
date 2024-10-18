using aspnetexam.Data.Models;

namespace aspnetexam.Services.Interfaces;

public interface IAuthService
{
    public Task<AccessInfo> LoginUserAsync(LoginUser user);
    public Task<User> RegisterUserAsync(RegisterUser user);
    public Task<AccessInfo> RefreshTokenAsync(TokenData userAccessData);
    public Task LogOutAsync(TokenData userTokenInfo);
}
