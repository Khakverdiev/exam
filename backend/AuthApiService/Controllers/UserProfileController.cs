using AuthAndProductData.Contexts;
using AuthAndProductData.DTOs;
using AuthAndProductData.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AuthApiService.Controllers;

[Authorize]
[ApiController]
[Route("api/userprofile")]
public class UserProfileController : ControllerBase
{
    private readonly AuthContext _context;

    public UserProfileController(AuthContext context)
    {
        _context = context;
    }

    [HttpGet("{userId}")]
    public async Task<ActionResult<UserProfileDto>> GetUserProfile(Guid userId)
    {
        var userProfile = await _context.UserProfiles
            .FirstOrDefaultAsync(up => up.UserId == userId);

        if (userProfile == null)
        {
            return NotFound("Профиль пользователя не найден.");
        }
        
        return Ok(new UserProfileDto
        {
            UserId = userProfile.UserId,
            FirstName = userProfile.FirstName,
            LastName = userProfile.LastName,
            PhoneNumber = userProfile.PhoneNumber,
            Address = userProfile.Address,
            City = userProfile.City,
            Country = userProfile.Country,
            PostalCode = userProfile.PostalCode
        });
    }

    [HttpGet("username/{username}")]
    public async Task<ActionResult<UserProfileDto>> GetUserProfileByUsername(string username)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
        if (user == null)
        {
            return NotFound("Пользователь не найден.");
        }

        var userProfile = await _context.UserProfiles
            .FirstOrDefaultAsync(up => up.UserId == user.Id);

        if (userProfile == null)
        {
            return NotFound("Профиль пользователя не найден.");
        }
        
        return Ok(new UserProfileDto
        {
            UserId = userProfile.UserId,
            FirstName = userProfile.FirstName,
            LastName = userProfile.LastName,
            PhoneNumber = userProfile.PhoneNumber,
            Address = userProfile.Address,
            City = userProfile.City,
            Country = userProfile.Country,
            PostalCode = userProfile.PostalCode
        });
    }

    [HttpPut("{userId}")]
    public async Task<IActionResult> UpdateUserProfile(Guid userId, UserProfile updatedProfile)
    {
        var existingUserProfile = await _context.UserProfiles
            .FirstOrDefaultAsync(up => up.UserId == userId);

        if (existingUserProfile == null)
        {
            return NotFound("Профиль пользователя не найден.");
        }

        existingUserProfile.FirstName = string.IsNullOrEmpty(updatedProfile.FirstName) ? existingUserProfile.FirstName : updatedProfile.FirstName;
        existingUserProfile.LastName = string.IsNullOrEmpty(updatedProfile.LastName) ? existingUserProfile.LastName : updatedProfile.LastName;
        existingUserProfile.PhoneNumber = string.IsNullOrEmpty(updatedProfile.PhoneNumber) ? existingUserProfile.PhoneNumber : updatedProfile.PhoneNumber;
        existingUserProfile.Address = string.IsNullOrEmpty(updatedProfile.Address) ? existingUserProfile.Address : updatedProfile.Address;
        existingUserProfile.City = string.IsNullOrEmpty(updatedProfile.City) ? existingUserProfile.City : updatedProfile.City;
        existingUserProfile.Country = string.IsNullOrEmpty(updatedProfile.Country) ? existingUserProfile.Country : updatedProfile.Country;
        existingUserProfile.PostalCode = string.IsNullOrEmpty(updatedProfile.PostalCode) ? existingUserProfile.PostalCode : updatedProfile.PostalCode;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            return Conflict("Запись была обновлена другим пользователем. Попробуйте снова.");
        }

        return NoContent();
    }
    
    [HttpDelete("{userId}")]
    public async Task<IActionResult> DeleteUserProfile(Guid userId)
    {
        var userProfile = await _context.UserProfiles.FindAsync(userId);
        if (userProfile == null)
        {
            return NotFound("Профиль пользователя не найден.");
        }

        _context.UserProfiles.Remove(userProfile);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}