namespace ProductApiService.Middlewares;

public class AdminRequestMiddleware
{
    private readonly RequestDelegate _next;

    public AdminRequestMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
     
    }
}