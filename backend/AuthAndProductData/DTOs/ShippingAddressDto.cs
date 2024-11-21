namespace AuthAndProductData.DTOs;

public record ShippingAddressDto(
    int Id,
    string Country,
    string City,
    string FirstName,
    string LastName,
    string Address,
    string ZipCode,
    string PhoneNumber
);