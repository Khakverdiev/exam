﻿using aspnetexam.Services.Interfaces;

namespace aspnetexam.Middlewares;

public class JwtSessionMiddleware : IMiddleware
{
    private readonly IBlackListService blackListService;

    public JwtSessionMiddleware(IBlackListService blackListService)
    {
        this.blackListService = blackListService;
    }
   
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        string? token = context.Request.Cookies["AccessToken"];

        if (string.IsNullOrWhiteSpace(token))
        {
            await next(context);
            return;
        }
        
        token = token.Replace("Bearer ", "");
        
        if (blackListService.IsTokenBlackListed(token))
        {
            context.Response.StatusCode = 403;
            await context.Response.WriteAsync("Unauthorized");
            return;
        }

        await next(context);
    }
}
