using System.ComponentModel.DataAnnotations;

namespace CesiZen.API.Models.Utilisateur
{
    public class ChangeMotDePasseRequest
    {
        [Required]
        public string AncienMotDePasse { get; set; } = string.Empty;

        [Required]
        [MinLength(8)]
        [MaxLength(128)]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$",
            ErrorMessage = "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial.")]
        public string NouveauMotDePasse { get; set; } = string.Empty;

        [Required]
        [Compare("NouveauMotDePasse", ErrorMessage = "Les mots de passe ne correspondent pas.")]
        public string ConfirmationMotDePasse { get; set; } = string.Empty;
    }
}
