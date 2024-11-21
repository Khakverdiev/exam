namespace AuthAndProductData.Models;

public class Product
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public decimal Price { get; set; }
    public string ImageUrl { get; set; }
    public int Quantity { get; set; }
    public ProductCategory Category { get; set; }
    public bool IsDeleted { get; set; }
    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();
    public virtual ICollection<ProductSize> Sizes { get; set; } = new List<ProductSize>();
}