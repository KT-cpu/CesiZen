using System.ComponentModel.DataAnnotations;

namespace CesiZen.API.Models.Information
{
    public class UpdateInformationRequest
    {
        [MaxLength(200)]
        public string? Titre { get; set; }

        [MaxLength(50)]
        public string? Type { get; set; }

        public string? Contenu { get; set; }
    }
}
