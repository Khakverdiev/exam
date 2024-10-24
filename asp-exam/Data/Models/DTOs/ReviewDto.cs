namespace aspnetexam.Data.Models.DTOs;

public class ReviewDto
{
    public int Id { get; set; }
    public Guid UserId { get; set; }
    public string Username { get; set; }
    public int ProductId { get; set; }
    public string ReviewText { get; set; }
    public int Rating { get; set; }
    public DateTime CreatedAt { get; set; }
    public string ProductName { get; set; }
    public string ProductImageUrl { get; set; }
}