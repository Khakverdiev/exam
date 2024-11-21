namespace aspnetexam.Data.Models.DTOs;

public class PaymentRequestDto
{
    public Guid UserId { get; set; }
    public decimal Amount { get; set; }
    public string PaymentProvider { get; set; }
    public PaymentDetailsDto PaymentDetails { get; set; }
}