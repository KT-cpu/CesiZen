using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CesiZen.Domain.Entities;
using CesiZen.Domain.Interfaces.Repository;
using CesiZen.Domain.Interfaces.Service;

namespace CesiZen.API.Services
{
    public class TrackerEmotionService : ITrackerEmotionService
    {
        private readonly ITrackerEmotionRepository _trackerRepository;
        private readonly IEmotion2Repository _emotion2Repository;

        public TrackerEmotionService(
            ITrackerEmotionRepository trackerRepository,
            IEmotion2Repository emotion2Repository)
        {
            _trackerRepository = trackerRepository;
            _emotion2Repository = emotion2Repository;
        }

        public async Task<IEnumerable<TrackerEmotion>> GetJournalAsync(int utilisateurId)
            => await _trackerRepository.GetByUtilisateurIdAsync(utilisateurId);

        public async Task<TrackerEmotion> GetByIdAsync(int id, int utilisateurId)
        {
            var tracker = await _trackerRepository.GetByIdWithDetailsAsync(id)
                ?? throw new KeyNotFoundException("Entrée de tracker introuvable.");

            if (tracker.UtilisateurId != utilisateurId)
                throw new UnauthorizedAccessException(
                    "Accès non autorisé à cette entrée.");

            return tracker;
        }

        public async Task<TrackerEmotion> AjouterAsync(
            int utilisateurId,
            int emotion2Id,
            DateTime? dateSaisie)
        {
            var emotion2Existe = await _emotion2Repository.ExistsAsync(e => e.Id == emotion2Id);
            if (!emotion2Existe)
                throw new KeyNotFoundException("L'émotion sélectionnée n'existe pas.");

            var tracker = new TrackerEmotion
            {
                UtilisateurId = utilisateurId,
                Emotion2Id = emotion2Id,
                DateSaisie = dateSaisie?.ToUniversalTime() ?? DateTime.UtcNow
            };

            await _trackerRepository.AddAsync(tracker);
            await _trackerRepository.SaveChangesAsync();

            return await _trackerRepository.GetByIdWithDetailsAsync(tracker.Id)
                ?? tracker;
        }

        public async Task<TrackerEmotion> ModifierAsync(
            int id,
            int utilisateurId,
            int emotion2Id,
            DateTime? dateSaisie)
        {
            var tracker = await GetByIdAsync(id, utilisateurId);

            var emotion2Existe = await _emotion2Repository.ExistsAsync(e => e.Id == emotion2Id);
            if (!emotion2Existe)
                throw new KeyNotFoundException("L'émotion sélectionnée n'existe pas.");

            tracker.Emotion2Id = emotion2Id;

            if (dateSaisie is not null)
                tracker.DateSaisie = dateSaisie.Value.ToUniversalTime();

            _trackerRepository.Update(tracker);
            await _trackerRepository.SaveChangesAsync();

            return await _trackerRepository.GetByIdWithDetailsAsync(tracker.Id)
                ?? tracker;
        }

        public async Task SupprimerAsync(int id, int utilisateurId)
        {
            var tracker = await GetByIdAsync(id, utilisateurId);

            _trackerRepository.Delete(tracker);
            await _trackerRepository.SaveChangesAsync();
        }

        public async Task<(IEnumerable<TrackerEmotion> entrees, DateTime debut, DateTime fin)>
            GetRapportAsync(int utilisateurId, DateTime debut, DateTime fin)
        {
            if (debut > fin)
                throw new ArgumentException(
                    "La date de début doit être antérieure à la date de fin.");

            if ((fin - debut).TotalDays > 366)
                throw new ArgumentException(
                    "La période ne peut pas dépasser 366 jours.");

            var entrees = await _trackerRepository.GetByPeriodeAsync(
                utilisateurId,
                debut.ToUniversalTime(),
                fin.ToUniversalTime());

            return (entrees, debut, fin);
        }
    }
}
