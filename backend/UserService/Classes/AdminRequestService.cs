using System.Security.Claims;
using AuthAndProductData.Contexts;
using AuthAndProductData.DTOs;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using UserService.Exceptions;
using UserService.Interfaces;

namespace UserService.Classes;

public class AdminRequestService : IAdminRequestService
{
    private readonly AuthContext _context;

    public AdminRequestService(AuthContext context)
    {
        _context = context;
    }
    
    public async Task<LoginResponseDto> CheckRequestAsync(AccessInfoDto accessInfo, HttpContext context)
    {
        var username = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var role = context.User.FindFirst(ClaimTypes.Role)?.Value;

        if (string.IsNullOrEmpty(username))
        {
            throw new MyAuthException(AuthErrorTypes.UserNotFound, "User not found.");
        }

        if (!Guid.TryParse(username, out var userId))
        {
            throw new MyAuthException(AuthErrorTypes.InvalidRequest, "Invalid user identifier.");
        }

        var userRole = await _context.UserRoles
            .Include(r => r.AppRole)
            .FirstOrDefaultAsync(r => r.UserId == userId);

        if (userRole == null || userRole.AppRole.Name != "AppAdmin")
        {
            throw new MyAuthException(AuthErrorTypes.InvalidCredentials, "Access denied: Admins only.");
        }

        return new LoginResponseDto(username, role, accessInfo.accessToken, accessInfo.refreshToken);
    }
}