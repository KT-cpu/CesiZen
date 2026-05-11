namespace CesiZen.API.Models.Tracker
{
    public class TrackerEmotionResponse
    {
        public int Id { get; set; }
        public DateTime DateSaisie { get; set; }
        public int Emotion2Id { get; set; }
        public string Emotion2Nom { get; set; } = string.Empty;
        public int Emotion1Id { get; set; }
        public string Emotion1Nom { get; set; } = string.Empty;
    }
}
