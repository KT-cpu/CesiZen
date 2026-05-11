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
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var utilisateur = await _authService.RegisterAsync(
                request.Pseudo,
                request.Email,
                request.MotDePasse);

            return StatusCode(201, new { message = "Compte créé avec succès." });
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var (utilisateur, token) = await _authService.LoginAsync(
                request.Email,
                request.MotDePasse);

            return Ok(new AuthResponse
            {
                Token = token,
                Expiration = DateTime.UtcNow.AddMinutes(60),
                Pseudo = utilisateur.Pseudo,
                Role = utilisateur.Role.ToString()
            });
        }
    }
}
