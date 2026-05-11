using System.ComponentModel.DataAnnotations;

namespace CesiZen.API.Models.Emotion
{
    public class CreateEmotion2Request
    {
        [Required]
        [MaxLength(50)]
        public string Nom { get; set; } = string.Empty;

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "L'identifiant de l'émotion de base est invalide.")]
        public int Emotion1Id { get; set; }
    }
}
