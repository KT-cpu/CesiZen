using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CesiZen.Domain.Entities
{
    public class Emotion1
    {
        public int Id { get; set; }
        public required string Nom { get; set; }
        public required string NomCreateur { get; set; }
        public DateTime DateCreation { get; set; }

        public ICollection<Emotion2> Emotions2 { get; set; }

        public Emotion1()
        {
            Emotions2 = new List<Emotion2>();
        }
    }
}
