using System.ComponentModel.DataAnnotations;

namespace CesiZen.API.Models.Auth
{
    public class LoginRequest
    {
        [Required(ErrorMessage = "L'email est obligatoire.")]
        [EmailAddress(ErrorMessage = "Format d'email invalide.")]
        [MaxLength(254)]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Le mot de passe est obligatoire.")]
        [MinLength(8, ErrorMessage = "Le mot de passe doit contenir au moins 8 caractères.")]
        [MaxLength(128, ErrorMessage = "Mot de passe trop long.")]
        public string MotDePasse { get; set; } = string.Empty;
    }
}
