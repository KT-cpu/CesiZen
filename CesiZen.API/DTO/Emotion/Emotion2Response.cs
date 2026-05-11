namespace CesiZen.API.Models.Emotion
{
    public class Emotion2Response
    {
        public int Id { get; set; }
        public string Nom { get; set; } = string.Empty;
        public string NomCreateur { get; set; } = string.Empty;
        public DateTime DateCreation { get; set; }
        public int Emotion1Id { get; set; }
        public string Emotion1Nom { get; set; } = string.Empty;
    }
}
