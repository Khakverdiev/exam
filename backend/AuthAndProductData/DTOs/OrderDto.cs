namespace AuthAndProductData.DTOs;

public class OrderDto
{
    public int Id { get; set; }
    public string Username { get; set; }
    public int ShippingAddressId { get; set; }
    public int PaymentDetailsId { get; set; }
    public List<OrderItemDto> OrderItems { get; set; }
    public string Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public decimal TotalPrice { get; set; }

    public OrderDto() { }
}