using System.Threading.Tasks;
using CesiZen.Domain.Entities;
using CesiZen.Domain.Interfaces.Repository;
using CesiZen.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CesiZen.Infrastructure.Repositories
{
    public class UtilisateurRepository : GenericRepository<Utilisateur>, IUtilisateurRepository
    {
        public UtilisateurRepository(ApplicationDbContext context) : base(context) { }

        public async Task<Utilisateur?> GetByEmailAsync(string email)
            => await _dbSet
                .FirstOrDefaultAsync(u => u.Email == email.ToLowerInvariant());

        public async Task<Utilisateur?> GetByPseudoAsync(string pseudo)
            => await _dbSet
                .FirstOrDefaultAsync(u => u.Pseudo == pseudo);

        public async Task<bool> EmailExistsAsync(string email)
            => await _dbSet
            .IgnoreQueryFilters() 
                .AnyAsync(u => u.Email == email.ToLowerInvariant());

        public async Task<bool> PseudoExistsAsync(string pseudo)
            => await _dbSet
                .IgnoreQueryFilters()
                .AnyAsync(u => u.Pseudo == pseudo);

        public async Task<Utilisateur?> GetByIdIgnoringFiltersAsync(int id)
            => await _dbSet
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(u => u.Id == id);

        public async Task<IEnumerable<Utilisateur>> GetAllIgnoringFiltersAsync()
            => await _dbSet
                .IgnoreQueryFilters()
                .ToListAsync();
    }
}
