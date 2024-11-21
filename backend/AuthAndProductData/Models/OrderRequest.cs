
namespace AuthAndProductData.Models;

public class OrderRequest
{
    public string Username { get; set; }
    public ShippingAddress ShippingAddress { get; set; }
    public string PaymentMethodNonce { get; set; }
    public int? OrderStatusId { get; set; }
    public int? PaymentId { get; set; }
    public List<OrderItemRequest> OrderItems { get; set; }
}