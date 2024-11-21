namespace AuthAndProductData.DTOs;

public class OrderRequestDto
{
    public string Username { get; set; }
    public List<OrderItemDto> OrderItems { get; set; }
    public ShippingAddressDto ShippingAddress { get; set; }
    public int? OrderStatusId { get; set; }
    public int? PaymentId { get; set; }
}