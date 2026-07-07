using System;
using System.Threading.Tasks;
using CesiZen.API.Models.Auth;
using CesiZen.Domain.Interfaces.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CesiZen.API.Controllers
{
    public class AuthController : BaseController
    {
        private const string AuthCookieName = "cesizen_token";
        private readonly IAuthService _authService;
        private readonly IWebHostEnvironment _env;

        public AuthController(IAuthService authService, IWebHostEnvironment env)
        {
            _authService = authService;
            _env = env;
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            await _authService.RegisterAsync(request.Pseudo, request.Email, request.MotDePasse);
            return StatusCode(201, new { message = "Compte créé avec succès." });
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var (utilisateur, token) = await _authService.LoginAsync(request.Email, request.MotDePasse);

            // Web : cookie httpOnly (le navigateur l'enverra automatiquement, same-origin)
            Response.Cookies.Append(AuthCookieName, token, new CookieOptions
            {
                HttpOnly = true,
                Secure = !_env.IsDevelopment(),   // désactivé en HTTP local, actif en HTTPS
                SameSite = SameSiteMode.Strict,    // protection CSRF
                Expires = DateTime.UtcNow.AddMinutes(60),
                Path = "/"
            });

            // Réponse inchangée : le token reste dans le corps pour le MOBILE (Stratégie A)
            return Ok(new AuthResponse
            {
                Token = token,
                Expiration = DateTime.UtcNow.AddMinutes(60),
                Pseudo = utilisateur.Pseudo,
                Role = utilisateur.Role.ToString()
            });
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
            return NoContent();
        }
    }
}
