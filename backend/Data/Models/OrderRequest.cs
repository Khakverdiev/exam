namespace aspnetexam.Data.Models;

public class OrderRequest
{
    public Guid UserId { get; set; }
    public ShippingAddress ShippingAddress { get; set; }
    public string CardNumber { get; set; }
    public string CardExpiry { get; set; }
    public int CardCVV { get; set; }
}
