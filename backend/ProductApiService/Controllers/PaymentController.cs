using AuthAndProductData.Contexts;
using AuthAndProductData.DTOs;
using AutoMapper;
using Braintree;
using Microsoft.AspNetCore.Mvc;
using ProductService.Interfaces;
using System.Threading.Tasks;
using AuthAndProductData.Models;
using Microsoft.EntityFrameworkCore;

namespace ProductApiService.Controllers;

[ApiController]
[Route("api/payment")]
public class PaymentController : ControllerBase
{
    private readonly IBraintreeService _braintreeService;
    private readonly AuthContext _context;
    private readonly IMapper _mapper;

    public PaymentController(IBraintreeService braintreeService, AuthContext context, IMapper mapper)
    {
        _braintreeService = braintreeService;
        _context = context;
        _mapper = mapper;
    }

    [HttpGet("generate-client-token")]
    public async Task<IActionResult> GenerateClientToken()
    {
        try
        {
            var clientToken = await _braintreeService.GenerateClientTokenAsync();
            return Ok(new { ClientToken = clientToken });
        }
        catch
        {
            return StatusCode(500, "An error occurred while generating the client token.");
        }
    }

    [HttpPost("create-transaction")]
    public async Task<IActionResult> CreateTransaction([FromBody] TransactionRequestDto request)
    {
        if (request == null || request.Amount <= 0 || string.IsNullOrEmpty(request.PaymentMethodNonce))
        {
            return BadRequest("Invalid transaction request.");
        }

        try
        {
            var result = await _braintreeService.CreateTransaction(request.Amount, request.PaymentMethodNonce);
        
            if (result.IsSuccess())
            {
                var transactionId = result.Target.Id;

                if (await _context.PaymentDetails.AnyAsync(p => p.TransactionId == transactionId))
                {
                    return Conflict("A payment with this transaction ID already exists.");
                }

                var paymentDetails = new PaymentDetails
                {
                    TransactionId = transactionId,
                    Amount = result.Target.Amount,
                    CreatedAt = DateTime.UtcNow
                };

                _context.PaymentDetails.Add(paymentDetails);
                await _context.SaveChangesAsync();

                var paymentDetailsDto = _mapper.Map<PaymentDetailsDto>(paymentDetails);

                return Ok(new
                {
                    Message = "Transaction successful",
                    PaymentDetails = paymentDetailsDto
                });
            }
            else
            {
                return BadRequest(new
                {
                    Message = "Transaction failed",
                    Errors = result.Errors.DeepAll()
                });
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine("Error in transaction: " + ex.Message);
            return StatusCode(500, "An error occurred while processing the transaction.");
        }
    }
}