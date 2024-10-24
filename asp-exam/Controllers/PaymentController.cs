using System.Globalization;
using aspnetexam.Data.Contexts;
using aspnetexam.Data.Models;
using aspnetexam.Data.Models.DTOs;
using aspnetexam.Mappers;
using aspnetexam.Services.Classes;
using aspnetexam.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace aspnetexam.Controllers;

[Route("api/[controller]")]
[ApiController]
public class PaymentController : ControllerBase
{
    private readonly AuthContext _context;

    public PaymentController(AuthContext context)
    {
        _context = context;
    }

    [HttpPost("process")]
    [Authorize(Roles = "appuser, appadmin")]
    public async Task<IActionResult> ProcessPayment([FromBody] PaymentRequestDto paymentRequestDto)
    {
        var user = await _context.Users.FindAsync(paymentRequestDto.UserId);
        if (user == null)
        {
            return NotFound("User not found.");
        }

        if (!IsPaymentValid(paymentRequestDto.PaymentDetails))
        {
            return BadRequest("Invalid payment details.");
        }

        var paymentStatus = SimulatePayment();
        var transactionId = Guid.NewGuid().ToString();

        var payment = new Payment
        {
            UserId = paymentRequestDto.UserId,
            PaymentProvider = paymentRequestDto.PaymentProvider,
            PaymentStatus = paymentStatus,
            Amount = paymentRequestDto.Amount,
            TransactionId = transactionId,
            PaymentDate = DateTime.UtcNow,
            User = user
        };

        _context.Payments.Add(payment);
        await _context.SaveChangesAsync();

        var paymentDto = payment.ToPaymentDto();
        return Ok(paymentDto);
    }

    [HttpGet("{id}")]
    [Authorize(Roles = "appuser, appadmin")]
    public async Task<IActionResult> GetPaymentById(int id)
    {
        var payment = await _context.Payments
            .Include(p => p.User)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (payment == null)
        {
            return NotFound("Payment not found.");
        }

        var paymentDto = payment.ToPaymentDto();
        return Ok(paymentDto);
    }

    private bool IsPaymentValid(PaymentDetailsDto paymentDetails)
    {
        if (string.IsNullOrEmpty(paymentDetails.CardNumber) || paymentDetails.CardNumber.Length != 16)
        {
            return false;
        }

        DateTime expiryDate;
        if (!DateTime.TryParseExact(paymentDetails.CardExpiry, "MM/yy", null, DateTimeStyles.None, out expiryDate))
        {
            return false;
        }

        if (expiryDate < DateTime.UtcNow)
        {
            return false;
        }

        if (paymentDetails.CardCVV.ToString().Length < 3 || paymentDetails.CardCVV.ToString().Length > 4)
        {
            return false;
        }

        return true;
    }

    private string SimulatePayment()
    {
        return "Success";
    }
}