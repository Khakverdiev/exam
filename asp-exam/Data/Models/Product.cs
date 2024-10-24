using System.Text.Json.Serialization;

namespace aspnetexam.Data.Models;

public class Product
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public decimal Price { get; set; }
    public string ImageUrl { get; set; }
    public int Quantity { get; set; }
    public string Category { get; set; }
    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();
}