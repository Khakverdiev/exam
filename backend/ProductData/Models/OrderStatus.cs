namespace ProductData.Models;

public class OrderStatus
{
    public int StatusId { get; set; }
    public string StatusName { get; set; } = null!;
    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
}