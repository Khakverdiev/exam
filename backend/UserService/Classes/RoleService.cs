using AuthAndProductData.Configs;
using AuthAndProductData.Contexts;
using AuthAndProductData.DTOs;
using AuthAndProductData.Models;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using UserService.Interfaces;

namespace UserService.Classes;

public class RoleService : IRoleService
{
    private readonly Mapper _mapper;
    private readonly AuthContext _context;

    public RoleService(AuthContext context)
    {
        _context = context;
        _mapper = MappingConfiguration.InitializeConfig();
    }
    
    public async Task<IEnumerable<RoleDto>> GetAllRolesAsync()
    {
        try
        {
            var roles = await _context.AppRoles.ToListAsync();
            return _mapper.Map<List<AppRole>, List<RoleDto>>(roles);
        }
        catch
        {
            throw;
        }
    }

    public async Task AddNewRoleAsync(RoleDto role)
    {
        try
        {
            var roleToAdd = _mapper.Map<RoleDto, AppRole>(role);
            await _context.AppRoles.AddAsync(roleToAdd);
            await _context.SaveChangesAsync();
        }
        catch
        {
            throw;
        }
    }
    
    public async Task GrantRoleAsync(GrantRoleDto roleDto)
    {
        var user = _context.Users.FirstOrDefault(x => x.Email == roleDto.email);
        var role = _context.AppRoles.FirstOrDefault(x => x.Name.ToLower() == roleDto.roleName.ToLower());

        var newUserRole = new UserRole()
        {
            RoleId = role.Id,
            UserId = user.Id
        };

        await _context.UserRoles.AddAsync(newUserRole);

        await _context.SaveChangesAsync();
    }
    
    public async Task RevokeRoleAsync(RevokeRoleDto roleDto)
    {
        var user = await _context.Users.FirstOrDefaultAsync(x => x.Email == roleDto.email);
        var role = await _context.AppRoles.FirstOrDefaultAsync(x => x.Name.ToLower() == roleDto.roleName.ToLower());

        if (user == null || role == null)
        {
            throw new Exception("Пользователь или роль не найдены.");
        }

        var userRole = await _context.UserRoles
            .FirstOrDefaultAsync(ur => ur.UserId == user.Id && ur.RoleId == role.Id);

        if (userRole == null)
        {
            throw new Exception("У пользователя нет данной роли.");
        }

        _context.UserRoles.Remove(userRole);
        await _context.SaveChangesAsync();
    }
}