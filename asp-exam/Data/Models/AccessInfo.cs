namespace aspnetexam.Data.Models;

public class AccessInfo
{
    public Guid UserId { get; set; }
    public string Username { get; set; }
    public string AccessToken { get; set; }
    public string RefreshToken { get; set; }
    public DateTime RefreshTokenExpireTime { get; set; }
    public string Role { get; set; }
}
