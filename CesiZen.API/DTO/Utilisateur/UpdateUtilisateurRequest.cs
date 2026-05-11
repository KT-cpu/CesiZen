using System.ComponentModel.DataAnnotations;

namespace CesiZen.API.Models.Utilisateur
{
    public class UpdateUtilisateurRequest
    {
        [MinLength(3)]
        [MaxLength(50)]
        [RegularExpression(@"^[a-zA-Z0-9_-]+$",
            ErrorMessage = "Le pseudo ne peut contenir que des lettres, chiffres, tirets et underscores.")]
        public string? Pseudo { get; set; }

        [EmailAddress]
        [MaxLength(254)]
        public string? Email { get; set; }
    }
}
