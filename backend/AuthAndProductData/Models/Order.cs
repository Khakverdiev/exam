namespace AuthAndProductData.Models;

public class Order
{
    public int Id { get; set; }
    public string Username { get; set; }
    public User User { get; set; }
    public int ShippingAddressId { get; set; }
    public ShippingAddress ShippingAddress { get; set; }
    public int? PaymentDetailsId { get; set; }
    public List<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    public int OrderStatusId { get; set; }
    public OrderStatus OrderStatus { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public decimal TotalPrice { get; set; }
}