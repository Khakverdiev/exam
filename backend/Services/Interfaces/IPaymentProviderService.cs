using aspnetexam.Data.Models;
using aspnetexam.Data.Models.DTOs;

namespace aspnetexam.Services.Interfaces;

public interface IPaymentProviderService
{
    Task<PaymentResponseDto> ProcessPaymentAsync(string provider, decimal amount, PaymentDetails paymentDetails);
}