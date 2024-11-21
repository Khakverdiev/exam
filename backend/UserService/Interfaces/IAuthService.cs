using AuthAndProductData.DTOs;
using AuthAndProductData.Models;

namespace UserService.Interfaces;

public interface IAuthService
{
    public Task<AccessInfoDto> LoginUserAsync(LoginDto user, bool isAdminLogin = false);
    public Task<User> RegisterUserAsync(RegisterDto user);
    public Task<AccessInfoDto> RefreshTokenAsync(TokenDto userAccessData);

    public Task LogOutAsync(TokenDto userTokenInfo);
}