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
    private IPaymentProviderService _paymentProviderService;

    public PaymentController(AuthContext context, IPaymentProviderService paymentProviderService)
    {
        _context = context;
        _paymentProviderService = paymentProviderService;
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
        
        var paymentDetails = new PaymentDetails
        {
            CardNumber = paymentRequestDto.PaymentDetails.CardNumber,
            CardExpiry = paymentRequestDto.PaymentDetails.CardExpiry,
            CardCVV = paymentRequestDto.PaymentDetails.CardCVV
        };
        
        var paymentResponse = await _paymentProviderService.ProcessPaymentAsync(
            paymentRequestDto.PaymentProvider,
            paymentRequestDto.Amount,
            paymentDetails
        );
        
        if (paymentResponse == null || paymentResponse.PaymentStatus != "Success")
        {
            return BadRequest("Payment failed. Please try again.");
        }
        
        var payment = new Payment
        {
            UserId = paymentRequestDto.UserId,
            PaymentProvider = paymentRequestDto.PaymentProvider,
            PaymentStatus = paymentResponse.PaymentStatus,
            Amount = paymentRequestDto.Amount,
            TransactionId = paymentResponse.TransactionId,
            PaymentDate = paymentResponse.PaymentDate,
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
}