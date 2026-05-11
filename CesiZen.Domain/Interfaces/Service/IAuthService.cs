using System.Threading.Tasks;
using CesiZen.Domain.Entities;

namespace CesiZen.Domain.Interfaces.Service
{
    public interface IAuthService
    {
        Task<(Utilisateur utilisateur, string token)> LoginAsync(string email, string motDePasse);
        Task<Utilisateur> RegisterAsync(string pseudo, string email, string motDePasse);
        string GenererToken(Utilisateur utilisateur);
        bool VerifierMotDePasse(string motDePasse, string hash);
        string HasherMotDePasse(string motDePasse);
    }
}
