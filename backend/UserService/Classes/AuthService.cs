using System.Security.Claims;
using AuthAndProductData.Contexts;
using AuthAndProductData.DTOs;
using AuthAndProductData.Models;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.EntityFrameworkCore;
using UserService.Exceptions;
using UserService.Interfaces;
using static BCrypt.Net.BCrypt;

namespace UserService.Classes;

public class AuthService : IAuthService
{
    private readonly AuthContext context;
    private readonly ITokenService tokenService;
    private readonly IBlackListService blackListService;
    public AuthService(AuthContext context, ITokenService tokenService, IBlackListService blackListService, IEmailSender emailSender)
    {
        this.context = context;
        this.tokenService = tokenService;
        this.blackListService = blackListService;
    }

    public async Task<AccessInfoDto> LoginUserAsync(LoginDto user, bool isAdminLogin = false)
    {
        var foundUser = await context.Users.FirstOrDefaultAsync(u => u.Username == user.Username);

        if (foundUser == null)
            throw new MyAuthException(AuthErrorTypes.UserNotFound, "User not found");

        if (!Verify(user.Password, foundUser.Password))
            throw new MyAuthException(AuthErrorTypes.InvalidCredentials, "Invalid credentials");

        var role = await context.UserRoles.Include(r => r.AppRole)
            .FirstOrDefaultAsync(r => r.UserId == foundUser.Id);

        if (role == null)
            throw new MyAuthException(AuthErrorTypes.RoleNotFound, "User role not found");

        if (isAdminLogin && role.AppRole.Name != "AppAdmin")
            throw new MyAuthException(AuthErrorTypes.AccessDenied, "Access denied: Admins only.");

        var accessToken = await tokenService.GenerateTokenAsync(foundUser);
        var refreshToken = await tokenService.GenerateRefreshTokenAsync();

        var tokenData = new AccessInfoDto(
            accessToken,
            refreshToken,
            DateTime.Now.AddDays(1),
            role.AppRole.Name
        );

        foundUser.RefreshToken = tokenData.refreshToken;
        foundUser.RefreshTokenExpiryTime = tokenData.refreshTokenExpireTime;

        await context.SaveChangesAsync();

        return tokenData;
    }

    public async Task<User> RegisterUserAsync(RegisterDto user)
    {
        try
        {
            var newUser = new User
            {
                Username = user.Username,
                Email = user.Email,
                Password = HashPassword(user.Password)
            };
            
            await context.Users.AddAsync(newUser);
            await context.SaveChangesAsync();

            var role = await context.AppRoles.FirstOrDefaultAsync(x => x.Name == "AppUser");
            
            if (role == null)
            {
                throw new Exception("Default role not found.");
            }

            var roleToApply = new UserRole()
            {
                RoleId = role.Id,
                UserId = newUser.Id
            };

            context.UserRoles.Add(roleToApply);
            await context.SaveChangesAsync();
            
            return newUser;
        }
        catch
        {
            throw;
        }
    }

    public async Task<AccessInfoDto> RefreshTokenAsync(TokenDto userAccessData)
    {
        if (userAccessData is null)
            throw new MyAuthException(AuthErrorTypes.InvalidRequest, "Invalid client request");

        var accessToken = userAccessData.AccessToken;
        var refreshToken = userAccessData.RefreshToken;

        var principal = tokenService.GetPrincipalFromToken(accessToken, validateLifetime: false);

        if (principal == null)
            throw new MyAuthException(AuthErrorTypes.InvalidToken, "Invalid access token");
    
        var username = principal.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

        var user = context.Users.FirstOrDefault(u => u.Username == username);
    
        if (user == null || user.RefreshToken != refreshToken || user.RefreshTokenExpiryTime <= DateTime.Now)
            throw new MyAuthException(AuthErrorTypes.InvalidRequest, "Invalid client request");

        var newAccessToken = await tokenService.GenerateTokenAsync(user);
        var newRefreshToken = await tokenService.GenerateRefreshTokenAsync();

        user.RefreshToken = newRefreshToken;
        user.RefreshTokenExpiryTime = DateTime.Now.AddDays(1);

        var role = await context.UserRoles
            .Include(r => r.AppRole)
            .Where(r => r.UserId == user.Id)
            .Select(r => r.AppRole.Name)
            .FirstOrDefaultAsync();

        if (string.IsNullOrEmpty(role))
            throw new MyAuthException(AuthErrorTypes.RoleNotFound, "User role not found");

        await context.SaveChangesAsync();

        return new AccessInfoDto(
            newAccessToken,
            newRefreshToken,
            user.RefreshTokenExpiryTime,
            role
        );
    }

    public async Task LogOutAsync(TokenDto userTokenInfo)
    {
        if (userTokenInfo is null)
            throw new MyAuthException(AuthErrorTypes.InvalidRequest, "Invalid client request");

        var principal = tokenService.GetPrincipalFromToken(userTokenInfo.AccessToken);

        var username = principal.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

        var user = context.Users.FirstOrDefault(u => u.Username == username);

        user.RefreshToken = null;
        user.RefreshTokenExpiryTime = DateTime.Now;
        await context.SaveChangesAsync();

        blackListService.AddTokenToBlackList(userTokenInfo.AccessToken);
    }
}