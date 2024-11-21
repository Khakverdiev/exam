namespace AuthAndProductData.DTOs;

public record OrderCreateDto(
    string Username,
    ShippingAddressDto ShippingAddress,
    List<OrderItemDto> OrderItems,
    PaymentDetailsDto PaymentDetails
);