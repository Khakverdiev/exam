namespace aspnetexam.Services.Interfaces;

public interface IBlobService
{
    Task<string> UploadFileAsync(IFormFile file);
    Task<bool> DeleteFileAsync(string blobName);
}