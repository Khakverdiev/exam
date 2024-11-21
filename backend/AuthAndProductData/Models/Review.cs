namespace AuthAndProductData.Models;

public class Review
{
    public int Id { get; set; }
    public string Username  { get; set; }
    public int ProductId { get; set; }
    public string ReviewText { get; set; }
    public int Rating { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User User { get; set; }
    public Product Product { get; set; } 
}