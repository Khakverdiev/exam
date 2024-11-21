namespace aspnetexam.Data.Models;

public class Order
{
    public int Id { get; set; }
    public Guid UserId { get; set; }
    public User User { get; set; }
    public int ShippingAddressId { get; set; }
    public ShippingAddress ShippingAddress { get; set; }
    public int PaymentDetailsId { get; set; }
    public PaymentDetails PaymentDetails { get; set; }
    public List<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    public string Status { get; set; } = "Pending";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
