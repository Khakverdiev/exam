using aspnetexam.Services.Interfaces;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;

namespace aspnetexam.Services.Classes;

public class BlobService : IBlobService
{
    private readonly BlobContainerClient _containerClient;

    public BlobService(BlobServiceClient blobServiceClient)
    {
        _containerClient = blobServiceClient.GetBlobContainerClient("clothimages");
    }
    
    public async Task<string> UploadFileAsync(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            throw new ArgumentException("File is empty");
        }

        var blobName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
        var blobClient = _containerClient.GetBlobClient(blobName);

        using (var stream = file.OpenReadStream())
        {
            await blobClient.UploadAsync(stream, new BlobHttpHeaders { ContentType = file.ContentType });
        }

        return blobClient.Uri.ToString();
    }

    public async Task<bool> DeleteFileAsync(string blobName)
    {
        var blobClient = _containerClient.GetBlobClient(blobName);
        return await blobClient.DeleteIfExistsAsync();
    }
}