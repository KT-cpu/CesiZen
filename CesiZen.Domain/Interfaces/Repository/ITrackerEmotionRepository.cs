using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CesiZen.Domain.Entities;

namespace CesiZen.Domain.Interfaces.Repository
{
    public interface ITrackerEmotionRepository : IGenericRepository<TrackerEmotion>
    {
        Task<IEnumerable<TrackerEmotion>> GetByUtilisateurIdAsync(int utilisateurId);
        Task<IEnumerable<TrackerEmotion>> GetByPeriodeAsync(
            int utilisateurId,
            DateTime debut,
            DateTime fin);
        Task<TrackerEmotion?> GetByIdWithDetailsAsync(int id);
    }
}
