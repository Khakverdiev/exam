namespace AuthAndProductData.DTOs;

public record PaymentDto(
    Guid UserId,
    string CardNumber,
    string CardExpiry,
    int? CardCVV,
    decimal Amount
);