using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CesiZen.Domain.Entities
{
    public class TrackerEmotion
    {
        public int Id { get; set; }
        public int UtilisateurId { get; set; }
        public Utilisateur Utilisateur { get; set; }
        public int Emotion2Id { get; set; }
        public Emotion2 Emotion2 { get; set; }
        public DateTime DateSaisie { get; set; }
    }
}
