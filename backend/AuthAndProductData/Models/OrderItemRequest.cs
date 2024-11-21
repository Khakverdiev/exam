namespace AuthAndProductData.Models;

public class OrderItemRequest
{
    public int ProductId { get; set; }
    public string Size { get; set; }
    public int Quantity { get; set; }
    public decimal Price { get; set; }
}
