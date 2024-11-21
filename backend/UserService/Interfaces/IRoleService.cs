using AuthAndProductData.DTOs;

namespace UserService.Interfaces;

public interface IRoleService
{
    public Task<IEnumerable<RoleDto>> GetAllRolesAsync();
    public Task GrantRoleAsync(GrantRoleDto roleDto);
    public Task AddNewRoleAsync(RoleDto role);
    public Task RevokeRoleAsync(RevokeRoleDto roleDto);
}