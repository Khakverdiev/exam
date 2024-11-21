using AuthAndProductData.DTOs;
using Microsoft.AspNetCore.Http;

namespace UserService.Interfaces;

public interface IAdminRequestService
{
    public Task<LoginResponseDto> CheckRequestAsync(AccessInfoDto accessInfo, HttpContext context);
}