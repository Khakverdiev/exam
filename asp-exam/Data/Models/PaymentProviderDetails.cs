namespace aspnetexam.Data.Models;

public class PaymentProviderDetails
{
    public int Id { get; set; }
    public string ProviderName { get; set; }
    public string ApiKey { get; set; }
    public string SecretKey { get; set; }
}