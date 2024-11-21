using Braintree;
using Microsoft.Extensions.Configuration;
using ProductService.Interfaces;

namespace ProductService.Classes;

public class BraintreeService : IBraintreeService
{
    private readonly BraintreeGateway _gateway;

    public BraintreeService(IConfiguration configuration)
    {
        _gateway = new BraintreeGateway
        {
            Environment = Braintree.Environment.SANDBOX,
            MerchantId = configuration["Braintree:MerchantId"],
            PublicKey = configuration["Braintree:PublicKey"],
            PrivateKey = configuration["Braintree:PrivateKey"],
        };
    }
    
    public async Task<string> GenerateClientTokenAsync()
    {
        var clientToken = await _gateway.ClientToken.GenerateAsync();
        return clientToken;
    }

    public async Task<Result<Transaction>> CreateTransaction(decimal amount, string paymentMethodNonce)
    {
        var request = new TransactionRequest
        {
            Amount = amount,
            PaymentMethodNonce = paymentMethodNonce,
            Options = new TransactionOptionsRequest
            {
                SubmitForSettlement = true
            }
        };

        return await _gateway.Transaction.SaleAsync(request);
    }
}