namespace aspnetexam.Data.Models.DTOs;

public class OrderDto
{
    public int Id { get; set; }
    public Guid UserId { get; set; }
    public string Username { get; set; }
    public List<OrderItemDto> OrderItems { get; set; } = new List<OrderItemDto>();
    public ShippingAddressDto ShippingAddress { get; set; }
    public PaymentDetailsDto PaymentDetails { get; set; }
    public string Status { get; set; }
    public DateTime CreatedAt { get; set; }
}