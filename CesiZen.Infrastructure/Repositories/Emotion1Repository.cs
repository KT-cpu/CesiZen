using System.Collections.Generic;
using System.Threading.Tasks;
using CesiZen.Domain.Entities;
using CesiZen.Domain.Interfaces.Repository;
using CesiZen.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CesiZen.Infrastructure.Repositories
{
    public class Emotion1Repository : GenericRepository<Emotion1>, IEmotion1Repository
    {
        public Emotion1Repository(ApplicationDbContext context) : base(context) { }

        public async Task<IEnumerable<Emotion1>> GetAllWithEmotions2Async()
            => await _dbSet
                .Include(e => e.Emotions2)
                .OrderBy(e => e.Nom)
                .ToListAsync();

        public async Task<Emotion1?> GetByIdWithEmotions2Async(int id)
            => await _dbSet
                .Include(e => e.Emotions2)
                .FirstOrDefaultAsync(e => e.Id == id);
    }
}
