using System;
using System.Collections.Generic;

namespace CesiZen.Domain.Entities
{
    public class Emotion2
    {
        public int Id { get; set; }
        public int Emotion1Id { get; set; }
        public Emotion1 Emotion1 { get; set; } = null!;
        public required string Nom { get; set; }
        public required string NomCreateur { get; set; }
        public DateTime DateCreation { get; set; }
        public ICollection<TrackerEmotion> TrackerEmotions { get; set; }
        public Emotion2()
        {
            TrackerEmotions = new List<TrackerEmotion>();
        }
    }
}
