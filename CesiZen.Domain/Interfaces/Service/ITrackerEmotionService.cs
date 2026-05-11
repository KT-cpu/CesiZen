using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CesiZen.Domain.Entities;

namespace CesiZen.Domain.Interfaces.Service
{
    public interface ITrackerEmotionService
    {
        Task<IEnumerable<TrackerEmotion>> GetJournalAsync(int utilisateurId);
        Task<TrackerEmotion> GetByIdAsync(int id, int utilisateurId);
        Task<TrackerEmotion> AjouterAsync(int utilisateurId, int emotion2Id, DateTime? dateSaisie);
        Task<TrackerEmotion> ModifierAsync(int id, int utilisateurId, int emotion2Id, DateTime? dateSaisie);
        Task SupprimerAsync(int id, int utilisateurId);
        Task<(IEnumerable<TrackerEmotion> entrees, DateTime debut, DateTime fin)> GetRapportAsync(
            int utilisateurId,
            DateTime debut,
            DateTime fin);
    }
}
