namespace AuthAndProductData.Models;

public class PaymentDetails
{
    public int Id { get; set; }
    public string TransactionId { get; set; }
    public decimal? Amount { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}