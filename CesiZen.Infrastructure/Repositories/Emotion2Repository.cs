using System.Collections.Generic;
using System.Threading.Tasks;
using CesiZen.Domain.Entities;
using CesiZen.Domain.Interfaces.Repository;
using CesiZen.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CesiZen.Infrastructure.Repositories
{
    public class Emotion2Repository : GenericRepository<Emotion2>, IEmotion2Repository
    {
        public Emotion2Repository(ApplicationDbContext context) : base(context) { }

        public async Task<IEnumerable<Emotion2>> GetByEmotion1IdAsync(int emotion1Id)
            => await _dbSet
                .Where(e => e.Emotion1Id == emotion1Id)
                .OrderBy(e => e.Nom)
                .ToListAsync();

        public async Task<Emotion2?> GetByIdWithEmotion1Async(int id)
            => await _dbSet
                .Include(e => e.Emotion1)
                .FirstOrDefaultAsync(e => e.Id == id);
    }
}
