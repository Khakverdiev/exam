namespace aspnetexam.Data.Models.DTOs;

public class OrderRequestDto
{
    public Guid UserId { get; set; }
    public List<OrderItemDto> OrderItems { get; set; }
    public ShippingAddressDto ShippingAddress { get; set; }
    public PaymentDetailsDto PaymentDetails { get; set; }
}