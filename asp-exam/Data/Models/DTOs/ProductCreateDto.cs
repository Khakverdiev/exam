namespace aspnetexam.Data.Models.DTOs;

public class ProductCreateDto
{
    public string Name { get; set; }
    public string Description { get; set; }
    public decimal Price { get; set; }
    public int Quantity { get; set; }
    public string Category { get; set; }
    public IFormFile ImageFile { get; set; }
}