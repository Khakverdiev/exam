using AuthAndProductData.Models;

namespace AuthAndProductData.DTOs;

public record ProductDto
{
    public int Id { get; init; }
    public string Name { get; init; }
    public string Description { get; init; }
    public decimal Price { get; init; }
    public int Quantity { get; init; }
    public string Category { get; init; }
    public string ImageUrl { get; init; }
    public List<string> Sizes { get; set; } = new List<string>();
}