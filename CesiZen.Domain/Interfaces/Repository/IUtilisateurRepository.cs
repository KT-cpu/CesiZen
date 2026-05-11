using System.Threading.Tasks;
using CesiZen.Domain.Entities;

namespace CesiZen.Domain.Interfaces.Repository
{
    public interface IUtilisateurRepository : IGenericRepository<Utilisateur>
    {
        Task<Utilisateur?> GetByEmailAsync(string email);
        Task<Utilisateur?> GetByPseudoAsync(string pseudo);
        Task<bool> EmailExistsAsync(string email);
        Task<bool> PseudoExistsAsync(string pseudo);
        Task<Utilisateur?> GetByIdIgnoringFiltersAsync(int id);
        Task<IEnumerable<Utilisateur>> GetAllIgnoringFiltersAsync();
    }
}
