using AuthAndProductData.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UserService.Interfaces;

namespace AuthApiService.Controllers;

[Authorize(Roles = "AppAdmin")]
[ApiController]
[Route("api/[controller]")]
public class RoleController : ControllerBase
{
    private readonly IRoleService _roleService;

    public RoleController(IRoleService roleService)
    {
        _roleService = roleService;
    }

    [HttpGet("All")]
    public async Task<IActionResult> GetAllRolesAsync()
    {
        var res = await _roleService.GetAllRolesAsync();

        return Ok(res);
    }

    [HttpPost("New")]
    public async Task AddNewRoleAsync([FromBody] RoleDto role)
    {
        await _roleService.AddNewRoleAsync(role);
    }
    
    [HttpPost("Grant")]
    public async Task GrantRoleAsync([FromBody] GrantRoleDto roleDto)
    {
        await _roleService.GrantRoleAsync(roleDto);
    }
    
    [HttpPost("Revoke")]
    public async Task<IActionResult> RevokeRoleAsync([FromBody] RevokeRoleDto roleDto)
    {
        await _roleService.RevokeRoleAsync(roleDto);
        return Ok(new { message = "Роль успешно удалена." });
    }
}