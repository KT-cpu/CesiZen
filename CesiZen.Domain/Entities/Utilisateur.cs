using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CesiZen.Domain.Enum;

namespace CesiZen.Domain.Entities
{
    public class Utilisateur
    {
        public int Id { get; set; }
        public required string Pseudo { get; set; }
        public RoleUtilisateur Role { get; set; }
        public bool EstActif { get; set; } = true;
        public  DateTime DateCreation { get; set; }
        public required string MotDePasseHash { get; set; }
        public required string Email { get; set; }

        public ICollection<TrackerEmotion> TrackerEmotions { get; set; }

        public Utilisateur()
        {
            TrackerEmotions = new List<TrackerEmotion>();
        }
    }
}
