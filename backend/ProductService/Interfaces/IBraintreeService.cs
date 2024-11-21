using Braintree;

namespace ProductService.Interfaces;

public interface IBraintreeService
{
    Task<string> GenerateClientTokenAsync();
    Task<Result<Transaction>> CreateTransaction(decimal amount, string paymentMethodNonce);
}