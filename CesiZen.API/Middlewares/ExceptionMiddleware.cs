using System;
using System.Collections.Generic;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace CesiZen.API.Middlewares
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            var (statusCode, message) = exception switch
            {
                UnauthorizedAccessException => (
                    HttpStatusCode.Unauthorized,
                    exception.Message),

                KeyNotFoundException => (
                    HttpStatusCode.NotFound,
                    exception.Message),

                InvalidOperationException => (
                    HttpStatusCode.BadRequest,
                    exception.Message),

                ArgumentException => (
                    HttpStatusCode.BadRequest,
                    exception.Message),

                _ => (
                    HttpStatusCode.InternalServerError,
                    "Une erreur interne est survenue.")
            };

            if (statusCode == HttpStatusCode.InternalServerError)
                _logger.LogError(exception,
                    "Erreur non gérée sur {Method} {Path}",
                    context.Request.Method,
                    context.Request.Path);
            else
                _logger.LogWarning(exception,
                    "Erreur métier {StatusCode} sur {Method} {Path}",
                    (int)statusCode,
                    context.Request.Method,
                    context.Request.Path);

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)statusCode;

            var response = JsonSerializer.Serialize(new
            {
                status = (int)statusCode,
                message
            });

            await context.Response.WriteAsync(response);
        }
    }
}
