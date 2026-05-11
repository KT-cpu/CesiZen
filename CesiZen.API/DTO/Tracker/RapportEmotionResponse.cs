namespace CesiZen.API.Models.Tracker
{
    public class RapportEmotionResponse
    {
        public DateTime Debut { get; set; }
        public DateTime Fin { get; set; }
        public int TotalEntrees { get; set; }
        public List<EmotionStat> StatistiquesParEmotion1 { get; set; } = new();
        public List<TrackerEmotionResponse> Entrees { get; set; } = new();
    }

    public class EmotionStat
    {
        public string Emotion1Nom { get; set; } = string.Empty;
        public int NombreOccurrences { get; set; }
        public double Pourcentage { get; set; }
    }
}
