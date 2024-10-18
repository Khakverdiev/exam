namespace aspnetexam.Data.Models.DTOs;

public class PaymentResponseDto
{
    public string TransactionId { get; set; }
    public string PaymentStatus { get; set; }
    public decimal Amount { get; set; }
    public DateTime PaymentDate { get; set; }
}