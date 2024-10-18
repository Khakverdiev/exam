namespace aspnetexam.Data.Models.DTOs;

public class PaymentDto
{
    public int Id { get; set; }
    public string PaymentProvider { get; set; }
    public string PaymentStatus { get; set; }
    public decimal Amount { get; set; }
    public string TransactionId { get; set; }
    public DateTime PaymentDate { get; set; }
}