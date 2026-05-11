using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using CesiZen.Domain.Entities;
using CesiZen.Domain.Enum;
using CesiZen.Domain.Interfaces.Repository;
using CesiZen.Domain.Interfaces.Service;

namespace CesiZen.API.Services
{
    public class UtilisateurService : IUtilisateurService
    {
        private readonly IUtilisateurRepository _utilisateurRepository;
        private readonly IAuthService _authService;

        public UtilisateurService(
            IUtilisateurRepository utilisateurRepository,
            IAuthService authService)
        {
            _utilisateurRepository = utilisateurRepository;
            _authService = authService;
        }

        public async Task<Utilisateur> GetByIdAsync(int id)
            => await _utilisateurRepository.GetByIdAsync(id)
                ?? throw new KeyNotFoundException("Utilisateur introuvable.");

        public async Task<IEnumerable<Utilisateur>> GetAllAsync()
            => await _utilisateurRepository.GetAllIgnoringFiltersAsync();

        public async Task<Utilisateur> UpdateAsync(int id, string? pseudo, string? email)
        {
            var utilisateur = await GetByIdAsync(id);

            if (pseudo is not null)
            {
                if (await _utilisateurRepository.PseudoExistsAsync(pseudo)
                    && utilisateur.Pseudo != pseudo)
                    throw new InvalidOperationException("Ce pseudo est déjà utilisé.");

                utilisateur.Pseudo = pseudo;
            }

            if (email is not null)
            {
                var emailNormalise = email.ToLowerInvariant();

                if (await _utilisateurRepository.EmailExistsAsync(emailNormalise)
                    && utilisateur.Email != emailNormalise)
                    throw new InvalidOperationException("Cet email est déjà utilisé.");

                utilisateur.Email = emailNormalise;
            }

            _utilisateurRepository.Update(utilisateur);
            await _utilisateurRepository.SaveChangesAsync();

            return utilisateur;
        }

        public async Task ChangeMotDePasseAsync(
            int id,
            string ancienMotDePasse,
            string nouveauMotDePasse)
        {
            var utilisateur = await GetByIdAsync(id);

            if (!_authService.VerifierMotDePasse(ancienMotDePasse, utilisateur.MotDePasseHash))
                throw new UnauthorizedAccessException("Ancien mot de passe incorrect.");

            if (ancienMotDePasse == nouveauMotDePasse)
                throw new InvalidOperationException(
                    "Le nouveau mot de passe doit être différent de l'ancien.");

            utilisateur.MotDePasseHash = _authService.HasherMotDePasse(nouveauMotDePasse);

            _utilisateurRepository.Update(utilisateur);
            await _utilisateurRepository.SaveChangesAsync();
        }

        public async Task<Utilisateur> AdminUpdateAsync(
            int id,
            string? pseudo,
            string? email,
            RoleUtilisateur? role,
            bool? estActif)
        {
            var utilisateur = await GetByIdAsAdminAsync(id);;

            if (pseudo is not null)
            {
                if (await _utilisateurRepository.PseudoExistsAsync(pseudo)
                    && utilisateur.Pseudo != pseudo)
                    throw new InvalidOperationException("Ce pseudo est déjà utilisé.");

                utilisateur.Pseudo = pseudo;
            }

            if (email is not null)
            {
                var emailNormalise = email.ToLowerInvariant();

                if (await _utilisateurRepository.EmailExistsAsync(emailNormalise)
                    && utilisateur.Email != emailNormalise)
                    throw new InvalidOperationException("Cet email est déjà utilisé.");

                utilisateur.Email = emailNormalise;
            }

            if (role is not null)
                utilisateur.Role = role.Value;

            if (estActif is not null)
                utilisateur.EstActif = estActif.Value;

            _utilisateurRepository.Update(utilisateur);
            await _utilisateurRepository.SaveChangesAsync();

            return utilisateur;
        }

        public async Task DesactiverAsync(int id)
        {
            var utilisateur = await GetByIdAsAdminAsync(id);
            utilisateur.EstActif = false;
            _utilisateurRepository.Update(utilisateur);
            await _utilisateurRepository.SaveChangesAsync();
        }

        public async Task SupprimerAsync(int id)
        {
            var utilisateur = await GetByIdAsAdminAsync(id);
            _utilisateurRepository.Delete(utilisateur);
            await _utilisateurRepository.SaveChangesAsync();
        }

        public async Task<Utilisateur> GetByIdAsAdminAsync(int id)
            => await _utilisateurRepository.GetByIdIgnoringFiltersAsync(id)
                ?? throw new KeyNotFoundException("Utilisateur introuvable.");
    }
}
