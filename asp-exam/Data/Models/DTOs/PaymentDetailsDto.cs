namespace aspnetexam.Data.Models.DTOs;

public class PaymentDetailsDto
{
    public string CardNumber { get; set; }
    public string CardExpiry { get; set; }
    public int CardCVV { get; set; }
}