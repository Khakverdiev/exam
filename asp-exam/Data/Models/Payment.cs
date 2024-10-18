namespace aspnetexam.Data.Models;

public class Payment
{
    public int Id { get; set; }
    public Guid UserId { get; set; }
    public string PaymentProvider { get; set; }
    public string PaymentStatus { get; set; }
    public decimal Amount { get; set; }
    public string TransactionId { get; set; }
    public DateTime PaymentDate { get; set; } = DateTime.UtcNow;
    
    public User User { get; set; }
}