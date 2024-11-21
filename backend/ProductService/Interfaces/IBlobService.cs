using Microsoft.AspNetCore.Http;

namespace ProductService.Interfaces;

public interface IBlobService
{
    Task<string> UploadFileAsync(IFormFile file);
    Task<bool> DeleteFileAsync(string blobName);
}