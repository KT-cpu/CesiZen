using System.Collections.Generic;
using System.Threading.Tasks;
using CesiZen.Domain.Entities;
using CesiZen.Domain.Interfaces.Repository;
using CesiZen.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CesiZen.Infrastructure.Repositories
{
    public class InformationRepository : GenericRepository<Information>, IInformationRepository
    {
        public InformationRepository(ApplicationDbContext context) : base(context) { }

        public async Task<IEnumerable<Information>> GetByTypeAsync(string type)
            => await _dbSet
                .Where(i => i.Type == type)
                .OrderByDescending(i => i.DateModification)
                .ToListAsync();

    }
}
