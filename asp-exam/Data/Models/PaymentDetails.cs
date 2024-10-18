namespace aspnetexam.Data.Models;

public class PaymentDetails
{
    public int Id { get; set; }
    public string CardNumber { get; set; }
    public string CardExpiry { get; set; }
    public int CardCVV { get; set; }
}