using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using CesiZen.Domain.Entities;
using CesiZen.Domain.Interfaces.Repository;
using CesiZen.Domain.Interfaces.Service;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace CesiZen.API.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUtilisateurRepository _utilisateurRepository;
        private readonly IConfiguration _configuration;

        public AuthService(
            IUtilisateurRepository utilisateurRepository,
            IConfiguration configuration)
        {
            _utilisateurRepository = utilisateurRepository;
            _configuration = configuration;
        }

        public async Task<(Utilisateur utilisateur, string token)> LoginAsync(
            string email,
            string motDePasse)
        {
            var utilisateur = await _utilisateurRepository.GetByEmailAsync(email)
                ?? throw new UnauthorizedAccessException("Identifiants invalides.");

            if (!utilisateur.EstActif)
                throw new UnauthorizedAccessException("Identifiants invalides.");

            if (!VerifierMotDePasse(motDePasse, utilisateur.MotDePasseHash))
                throw new UnauthorizedAccessException("Identifiants invalides.");

            var token = GenererToken(utilisateur);
            return (utilisateur, token);
        }

        public async Task<Utilisateur> RegisterAsync(
            string pseudo,
            string email,
            string motDePasse)
        {
            if (await _utilisateurRepository.EmailExistsAsync(email))
                throw new InvalidOperationException("Cet email est déjà utilisé.");

            if (await _utilisateurRepository.PseudoExistsAsync(pseudo))
                throw new InvalidOperationException("Ce pseudo est déjà utilisé.");

            var utilisateur = new Utilisateur
            {
                Pseudo = pseudo,
                Email = email.ToLowerInvariant(),
                MotDePasseHash = HasherMotDePasse(motDePasse),
                Role = Domain.Enum.RoleUtilisateur.Utilisateur,
                EstActif = true,
                DateCreation = DateTime.UtcNow
            };

            await _utilisateurRepository.AddAsync(utilisateur);
            await _utilisateurRepository.SaveChangesAsync();

            return utilisateur;
        }

        public string GenererToken(Utilisateur utilisateur)
        {
            var secret = _configuration["JwtSettings:Secret"]
                ?? throw new InvalidOperationException(
                    "La clé JWT n'est pas configurée.");

            if (secret.Length < 32)
                throw new InvalidOperationException(
                    "La clé JWT est trop courte (minimum 32 caractères).");

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub,
                    utilisateur.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email,
                    utilisateur.Email),
                new Claim(ClaimTypes.Role,
                    utilisateur.Role.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti,
                    Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Iat,
                    DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString(),
                    ClaimValueTypes.Integer64)
            };

            var expirationMinutes = int.TryParse(
                _configuration["JwtSettings:ExpirationMinutes"],
                out var minutes) ? minutes : 60;

            var token = new JwtSecurityToken(
                issuer: _configuration["JwtSettings:Issuer"],
                audience: _configuration["JwtSettings:Audience"],
                claims: claims,
                notBefore: DateTime.UtcNow,
                expires: DateTime.UtcNow.AddMinutes(expirationMinutes),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public bool VerifierMotDePasse(string motDePasse, string hash)
            => BCrypt.Net.BCrypt.Verify(motDePasse, hash);

        public string HasherMotDePasse(string motDePasse)
            => BCrypt.Net.BCrypt.HashPassword(motDePasse, workFactor: 12);
    }
}
