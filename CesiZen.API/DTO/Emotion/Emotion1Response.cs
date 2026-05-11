namespace CesiZen.API.Models.Emotion
{
    public class Emotion1Response
    {
        public int Id { get; set; }
        public string Nom { get; set; } = string.Empty;
        public string NomCreateur { get; set; } = string.Empty;
        public DateTime DateCreation { get; set; }
        public List<Emotion2Response> Emotions2 { get; set; } = new();
    }
}
