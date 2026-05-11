using System.ComponentModel.DataAnnotations;

namespace CesiZen.API.Models.Emotion
{
    public class CreateEmotion1Request
    {
        [Required]
        [MaxLength(50)]
        public string Nom { get; set; } = string.Empty;
    }
}
