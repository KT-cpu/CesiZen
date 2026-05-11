using System.Collections.Generic;
using System.Threading.Tasks;
using CesiZen.Domain.Entities;

namespace CesiZen.Domain.Interfaces.Service
{
    public interface IInformationService
    {
        Task<IEnumerable<Information>> GetAllAsync();
        Task<IEnumerable<Information>> GetByTypeAsync(string type);
        Task<Information> GetByIdAsync(int id);

        Task<Information> CreerAsync(string titre, string type, string contenu);
        Task<Information> ModifierAsync(int id, string? titre, string? type, string? contenu);
        Task SupprimerAsync(int id);
    }
}
