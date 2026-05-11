using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CesiZen.Domain.Entities;
using CesiZen.Domain.Interfaces.Repository;
using CesiZen.Domain.Interfaces.Service;

namespace CesiZen.API.Services
{
    public class InformationService : IInformationService
    {
        private readonly IInformationRepository _informationRepository;

        public InformationService(IInformationRepository informationRepository)
        {
            _informationRepository = informationRepository;
        }

        public async Task<IEnumerable<Information>> GetAllAsync()
            => await _informationRepository.GetAllAsync();

        public async Task<IEnumerable<Information>> GetByTypeAsync(string type)
            => await _informationRepository.GetByTypeAsync(type);

        public async Task<Information> GetByIdAsync(int id)
            => await _informationRepository.GetByIdAsync(id)
                ?? throw new KeyNotFoundException("Information introuvable.");

        public async Task<Information> CreerAsync(
            string titre,
            string type,
            string contenu)
        {
            var information = new Information
            {
                Titre = titre,
                Type = type,
                Contenu = contenu,
                DateCreation = DateTime.UtcNow,
                DateModification = DateTime.UtcNow
            };

            await _informationRepository.AddAsync(information);
            await _informationRepository.SaveChangesAsync();

            return information;
        }

        public async Task<Information> ModifierAsync(
            int id,
            string? titre,
            string? type,
            string? contenu)
        {
            var information = await GetByIdAsync(id);

            if (titre is not null) information.Titre = titre;
            if (type is not null) information.Type = type;
            if (contenu is not null) information.Contenu = contenu;

            information.DateModification = DateTime.UtcNow;

            _informationRepository.Update(information);
            await _informationRepository.SaveChangesAsync();

            return information;
        }

        public async Task SupprimerAsync(int id)
        {
            var information = await GetByIdAsync(id);

            _informationRepository.Delete(information);
            await _informationRepository.SaveChangesAsync();
        }
    }
}
