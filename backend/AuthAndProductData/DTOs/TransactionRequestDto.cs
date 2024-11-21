namespace AuthAndProductData.DTOs;

public class TransactionRequestDto
{
    public decimal Amount { get; set; }
    public string PaymentMethodNonce { get; set; }
}