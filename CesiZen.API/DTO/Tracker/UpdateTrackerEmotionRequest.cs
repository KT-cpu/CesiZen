using System.ComponentModel.DataAnnotations;

namespace CesiZen.API.Models.Tracker
{
    public class UpdateTrackerEmotionRequest
    {
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "L'identifiant de l'émotion est invalide.")]
        public int Emotion2Id { get; set; }

        public DateTime? DateSaisie { get; set; }
    }
}
