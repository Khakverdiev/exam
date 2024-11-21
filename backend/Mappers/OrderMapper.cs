using aspnetexam.Data.Models;
using aspnetexam.Data.Models.DTOs;

namespace aspnetexam.Mappers;

public static class OrderMapper
{
    public static Order ToOrder(this OrderRequestDto dto)
    {
        return new Order
        {
            UserId = dto.UserId,
            ShippingAddress = new ShippingAddress
            {
                Country = dto.ShippingAddress.Country,
                FirstName = dto.ShippingAddress.FirstName,
                LastName = dto.ShippingAddress.LastName,
                Address = dto.ShippingAddress.Address,
                ZipCode = dto.ShippingAddress.ZipCode,
                PhoneNumber = dto.ShippingAddress.PhoneNumber
            },
            PaymentDetails = new PaymentDetails
            {
                CardNumber = dto.PaymentDetails.CardNumber,
                CardExpiry = dto.PaymentDetails.CardExpiry,
                CardCVV = dto.PaymentDetails.CardCVV
            },
            OrderItems = dto.OrderItems.Select(item => new OrderItem
            {
                ProductId = item.ProductId,
                Quantity = item.Quantity,
                Price = item.Price
            }).ToList(),
            Status = "Pending",
            CreatedAt = DateTime.UtcNow
        };
    }
    
    public static OrderDto ToOrderDto(this Order order)
    {
        return new OrderDto
        {
            Id = order.Id,
            UserId = order.UserId,
            Username = order.User?.Username,
            OrderItems = order.OrderItems.Select(item => new OrderItemDto
            {
                ProductId = item.ProductId,
                ProductName = item.Product?.Name,
                Quantity = item.Quantity,
                Price = item.Price
            }).ToList(),
            ShippingAddress = new ShippingAddressDto
            {
                Country = order.ShippingAddress?.Country,
                FirstName = order.ShippingAddress?.FirstName,
                LastName = order.ShippingAddress?.LastName,
                Address = order.ShippingAddress?.Address,
                ZipCode = order.ShippingAddress?.ZipCode,
                PhoneNumber = order.ShippingAddress?.PhoneNumber
            },
            PaymentDetails = new PaymentDetailsDto
            {
                CardNumber = order.PaymentDetails?.CardNumber,
                CardExpiry = order.PaymentDetails?.CardExpiry,
                CardCVV = order.PaymentDetails?.CardCVV ?? 0
            },
            Status = order.Status,
            CreatedAt = order.CreatedAt
        };
    }
}

