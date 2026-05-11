using System.ComponentModel.DataAnnotations;

namespace CesiZen.API.Models.Auth
{
    public class RegisterRequest
    {
        [Required(ErrorMessage = "Le pseudo est obligatoire.")]
        [MinLength(3, ErrorMessage = "Le pseudo doit contenir au moins 3 caractères.")]
        [MaxLength(50, ErrorMessage = "Le pseudo ne peut pas dépasser 50 caractères.")]
        [RegularExpression(@"^[a-zA-Z0-9_-]+$",
            ErrorMessage = "Le pseudo ne peut contenir que des lettres, chiffres, tirets et underscores.")]
        public string Pseudo { get; set; } = string.Empty;

        [Required(ErrorMessage = "L'email est obligatoire.")]
        [EmailAddress(ErrorMessage = "Format d'email invalide.")]
        [MaxLength(254)]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Le mot de passe est obligatoire.")]
        [MinLength(8, ErrorMessage = "Le mot de passe doit contenir au moins 8 caractères.")]
        [MaxLength(128, ErrorMessage = "Mot de passe trop long.")]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$",
            ErrorMessage = "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial.")]
        public string MotDePasse { get; set; } = string.Empty;

        [Required(ErrorMessage = "La confirmation du mot de passe est obligatoire.")]
        [Compare("MotDePasse", ErrorMessage = "Les mots de passe ne correspondent pas.")]
        public string ConfirmationMotDePasse { get; set; } = string.Empty;
    }
}
