using System.ComponentModel.DataAnnotations;
using CesiZen.Domain.Enum;

namespace CesiZen.API.Models.Utilisateur
{
    public class AdminUpdateUtilisateurRequest
    {
        [MinLength(3)]
        [MaxLength(50)]
        [RegularExpression(@"^[a-zA-Z0-9_-]+$")]
        public string? Pseudo { get; set; }

        [EmailAddress]
        [MaxLength(254)]
        public string? Email { get; set; }

        public RoleUtilisateur? Role { get; set; }

        public bool? EstActif { get; set; }
    }
}
