using AuthAndProductData.Models;
using Microsoft.AspNetCore.Http;
namespace AuthAndProductData.DTOs;

public class ProductCreateDto
{
    public string Name { get; set; }
    public string Description { get; set; }
    public decimal Price { get; set; }
    public int Quantity { get; set; }
    public ProductCategory Category { get; set; }
    public IFormFile ImageFile { get; set; }
    public List<string> Sizes { get; set; }
}