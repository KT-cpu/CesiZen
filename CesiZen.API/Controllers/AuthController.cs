using System;
using System.Threading.Tasks;
using CesiZen.API.Models.Auth;
using CesiZen.Domain.Interfaces.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Http;
namespace CesiZen.API.Controllers
{
    public class AuthController : BaseController
    {
        private const string AuthCookieName = "cesizen_token";
        private readonly IAuthService _authService;
        private readonly IWebHostEnvironment _env;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthService authService, IWebHostEnvironment env, ILogger<AuthController> logger)
        {
            _authService = authService;
            _env = env;
            _logger = logger;
        }

        [AllowAnonymous]
        [EnableRateLimiting("auth")]
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            await _authService.RegisterAsync(request.Pseudo, request.Email, request.MotDePasse);
            _logger.LogInformation("Security event {Event} email={Email} ip={Ip}",
            "auth.register", request.Email,
            HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown");
            return StatusCode(201, new { message = "Compte créé avec succès." });
        }

        [AllowAnonymous]
        [EnableRateLimiting("auth")]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var ip = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";

            try
            {
                var (utilisateur, token) = await _authService.LoginAsync(request.Email, request.MotDePasse);

                Response.Cookies.Append(AuthCookieName, token, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = !_env.IsDevelopment(),
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTime.UtcNow.AddMinutes(60),
                    Path = "/"
                });

                _logger.LogInformation("Security event {Event} email={Email} ip={Ip}",
                    "auth.login.success", request.Email, ip);

                return Ok(new AuthResponse
                {
                    Token = token,
                    Expiration = DateTime.UtcNow.AddMinutes(60),
                    Pseudo = utilisateur.Pseudo,
                    Role = utilisateur.Role.ToString()
                });
            }
            catch (UnauthorizedAccessException)
            {
                _logger.LogWarning("Security event {Event} email={Email} ip={Ip}",
                    "auth.login.failure", request.Email, ip);
                throw;
            }
        }

        [Authorize]
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete(AuthCookieName, new CookieOptions
            {
                HttpOnly = true,
                Secure = !_env.IsDevelopment(),
                SameSite = SameSiteMode.Strict,
                Path = "/"
            });
            _logger.LogInformation("Security event {Event} email={Email}",
            "auth.logout", User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value ?? "unknown");
            return NoContent();
        }
    }
}
