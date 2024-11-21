namespace AuthAndProductData.DTOs;

public record PaymentDetailsDto(
    int Id,
    string TransactionId,
    decimal? Amount,
    DateTime CreatedAt
);