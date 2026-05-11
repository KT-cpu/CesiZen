namespace CesiZen.API.Models.Utilisateur
{
    public class UtilisateurResponse
    {
        public int Id { get; set; }
        public string Pseudo { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public bool EstActif { get; set; }
        public DateTime DateCreation { get; set; }
    }
}
