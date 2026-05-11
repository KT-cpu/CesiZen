using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CesiZen.Domain.Entities;
using CesiZen.Domain.Interfaces.Repository;
using CesiZen.Domain.Interfaces.Service;

namespace CesiZen.API.Services
{
    public class EmotionService : IEmotionService
    {
        private readonly IEmotion1Repository _emotion1Repository;
        private readonly IEmotion2Repository _emotion2Repository;

        public EmotionService(
            IEmotion1Repository emotion1Repository,
            IEmotion2Repository emotion2Repository)
        {
            _emotion1Repository = emotion1Repository;
            _emotion2Repository = emotion2Repository;
        }

        public async Task<IEnumerable<Emotion1>> GetAllEmotions1Async()
            => await _emotion1Repository.GetAllWithEmotions2Async();

        public async Task<Emotion1> GetEmotion1ByIdAsync(int id)
            => await _emotion1Repository.GetByIdWithEmotions2Async(id)
                ?? throw new KeyNotFoundException("Émotion de base introuvable.");

        public async Task<IEnumerable<Emotion2>> GetEmotions2ByEmotion1IdAsync(int emotion1Id)
        {
            var emotion1Existe = await _emotion1Repository.ExistsAsync(e => e.Id == emotion1Id);
            if (!emotion1Existe)
                throw new KeyNotFoundException("Émotion de base introuvable.");

            return await _emotion2Repository.GetByEmotion1IdAsync(emotion1Id);
        }

        public async Task<Emotion2> GetEmotion2ByIdAsync(int id)
            => await _emotion2Repository.GetByIdWithEmotion1Async(id)
                ?? throw new KeyNotFoundException("Émotion introuvable.");

        public async Task<Emotion1> CreerEmotion1Async(string nom, string nomCreateur)
        {
            if (await _emotion1Repository.ExistsAsync(e => e.Nom == nom))
                throw new InvalidOperationException(
                    $"Une émotion de base nommée '{nom}' existe déjà.");

            var emotion1 = new Emotion1
            {
                Nom = nom,
                NomCreateur = nomCreateur,
                DateCreation = DateTime.UtcNow
            };

            await _emotion1Repository.AddAsync(emotion1);
            await _emotion1Repository.SaveChangesAsync();

            return emotion1;
        }

        public async Task<Emotion2> CreerEmotion2Async(
            string nom,
            string nomCreateur,
            int emotion1Id)
        {
            var emotion1Existe = await _emotion1Repository.ExistsAsync(e => e.Id == emotion1Id);
            if (!emotion1Existe)
                throw new KeyNotFoundException("Émotion de base introuvable.");

            if (await _emotion2Repository.ExistsAsync(e => e.Nom == nom && e.Emotion1Id == emotion1Id))
                throw new InvalidOperationException(
                    $"Une émotion nommée '{nom}' existe déjà.");

            var emotion2 = new Emotion2
            {
                Nom = nom,
                NomCreateur = nomCreateur,
                Emotion1Id = emotion1Id,
                DateCreation = DateTime.UtcNow
            };

            await _emotion2Repository.AddAsync(emotion2);
            await _emotion2Repository.SaveChangesAsync();

            return await _emotion2Repository.GetByIdWithEmotion1Async(emotion2.Id)
                ?? emotion2;
        }

        public async Task SupprimerEmotion1Async(int id)
        {
            var emotion1 = await _emotion1Repository.GetByIdWithEmotions2Async(id)
                ?? throw new KeyNotFoundException("Émotion de base introuvable.");

            if (emotion1.Emotions2.Count > 0)
                throw new InvalidOperationException(
                    "Impossible de supprimer cette émotion de base : " +
                    "des sous-émotions y sont rattachées.");

            _emotion1Repository.Delete(emotion1);
            await _emotion1Repository.SaveChangesAsync();
        }

        public async Task SupprimerEmotion2Async(int id)
        {
            var emotion2 = await _emotion2Repository.GetByIdAsync(id)
                ?? throw new KeyNotFoundException("Émotion introuvable.");

            _emotion2Repository.Delete(emotion2);
            await _emotion2Repository.SaveChangesAsync();
        }
    }
}
