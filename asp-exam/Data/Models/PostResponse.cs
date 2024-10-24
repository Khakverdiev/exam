namespace aspnetexam.Data.Models;

public class PostResponse
{
    public string Message { get; set; }
    public int StatusCode { get; set; }

    public PostResponse(string message, int statusCode)
    {
        Message = message;
        StatusCode = statusCode;
    }
}