using aspnetexam.Data.Models;
using aspnetexam.Data.Models.DTOs;

namespace aspnetexam.Mappers;

public static class PaymentMapper
{
    public static PaymentDto ToPaymentDto(this Payment payment)
    {
        return new PaymentDto
        {
            Id = payment.Id,
            PaymentProvider = payment.PaymentProvider,
            PaymentStatus = payment.PaymentStatus,
            Amount = payment.Amount,
            TransactionId = payment.TransactionId,
            PaymentDate = payment.PaymentDate
        };
    }
}