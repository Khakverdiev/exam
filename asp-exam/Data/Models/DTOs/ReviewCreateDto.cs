namespace aspnetexam.Data.Models.DTOs;

public class ReviewCreateDto
{
    public Guid UserId { get; set; }
    public int ProductId { get; set; }
    public string ReviewText { get; set; }
    public int Rating { get; set; }
}