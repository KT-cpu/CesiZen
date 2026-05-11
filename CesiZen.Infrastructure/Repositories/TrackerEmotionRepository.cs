using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CesiZen.Domain.Entities;
using CesiZen.Domain.Interfaces.Repository;
using CesiZen.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CesiZen.Infrastructure.Repositories
{
    public class TrackerEmotionRepository : GenericRepository<TrackerEmotion>, ITrackerEmotionRepository
    {
        public TrackerEmotionRepository(ApplicationDbContext context) : base(context) { }

        public async Task<IEnumerable<TrackerEmotion>> GetByUtilisateurIdAsync(int utilisateurId)
            => await _dbSet
                .Include(t => t.Emotion2)
                    .ThenInclude(e => e.Emotion1)
                .Where(t => t.UtilisateurId == utilisateurId)
                .OrderByDescending(t => t.DateSaisie)
                .ToListAsync();

        public async Task<IEnumerable<TrackerEmotion>> GetByPeriodeAsync(
            int utilisateurId,
            DateTime debut,
            DateTime fin)
            => await _dbSet
                .Include(t => t.Emotion2)
                    .ThenInclude(e => e.Emotion1)
                .Where(t =>
                    t.UtilisateurId == utilisateurId &&
                    t.DateSaisie >= debut &&
                    t.DateSaisie <= fin)
                .OrderByDescending(t => t.DateSaisie)
                .ToListAsync();

        public async Task<TrackerEmotion?> GetByIdWithDetailsAsync(int id)
            => await _dbSet
                .Include(t => t.Emotion2)
                    .ThenInclude(e => e.Emotion1)
                .FirstOrDefaultAsync(t => t.Id == id);
    }
}
