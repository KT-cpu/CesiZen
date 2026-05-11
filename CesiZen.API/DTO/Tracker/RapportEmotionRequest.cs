using System.ComponentModel.DataAnnotations;

namespace CesiZen.API.Models.Tracker
{
    public class RapportEmotionRequest
    {
        [Required]
        public DateTime Debut { get; set; }

        [Required]
        public DateTime Fin { get; set; }
    }
}
