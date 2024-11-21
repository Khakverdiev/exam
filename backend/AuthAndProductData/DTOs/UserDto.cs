namespace AuthAndProductData.DTOs;

public class UserDto
{
    public Guid Id { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }
    public bool IsEmailConfirmed { get; set; }
}