namespace CesiZen.API.Models.Auth
{
    public class AuthResponse
    {
        public string Token { get; set; } = string.Empty;
        public DateTime Expiration { get; set; }
        public string Pseudo { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
    }
}
