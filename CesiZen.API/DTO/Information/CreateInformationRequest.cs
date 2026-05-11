using System.ComponentModel.DataAnnotations;

namespace CesiZen.API.Models.Information
{
    public class CreateInformationRequest
    {
        [Required]
        [MaxLength(200)]
        public string Titre { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string Type { get; set; } = string.Empty;

        [Required]
        public string Contenu { get; set; } = string.Empty;
    }
}
