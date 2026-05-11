namespace CesiZen.API.Models.Information
{
    public class InformationResponse
    {
        public int Id { get; set; }
        public string Titre { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Contenu { get; set; } = string.Empty;
        public DateTime DateCreation { get; set; }
        public DateTime DateModification { get; set; }
    }
}
