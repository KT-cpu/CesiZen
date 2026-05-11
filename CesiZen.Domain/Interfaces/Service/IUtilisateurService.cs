using System.Collections.Generic;
using System.Threading.Tasks;
using CesiZen.Domain.Entities;
using CesiZen.Domain.Enum;

namespace CesiZen.Domain.Interfaces.Service
{
    public interface IUtilisateurService
    {
        Task<Utilisateur> GetByIdAsync(int id);
        Task<Utilisateur> UpdateAsync(int id, string? pseudo, string? email);
        Task ChangeMotDePasseAsync(int id, string ancienMotDePasse, string nouveauMotDePasse);

        Task<IEnumerable<Utilisateur>> GetAllAsync();
        Task<Utilisateur> AdminUpdateAsync(int id, string? pseudo, string? email, RoleUtilisateur? role, bool? estActif);
        Task DesactiverAsync(int id);
        Task SupprimerAsync(int id);
        Task<Utilisateur> GetByIdAsAdminAsync(int id);
    }
}
