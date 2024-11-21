namespace aspnetexam.Data.Models;

public class FavoriteProduct
{
    public int Id { get; set; }
    public Guid UserId { get; set; }
    public int ProductId { get; set; }
    public User User { get; set; }
    public Product Product { get; set; }
}
