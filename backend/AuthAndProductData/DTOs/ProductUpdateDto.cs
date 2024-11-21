using AuthAndProductData.Models;

namespace AuthAndProductData.DTOs;

public record ProductUpdateDto
{
    public string Name { get; set; }
    public string Description { get; set; }
    public decimal Price { get; set; }
    public string ImageUrl { get; set; }
    public int Quantity { get; set; }
    public int Category { get; set; }
    public List<string> Sizes { get; set; } = new List<string>();
}