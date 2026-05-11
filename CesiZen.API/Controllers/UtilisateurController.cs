using System.Linq;
using System.Threading.Tasks;
using CesiZen.API.Models.Utilisateur;
using CesiZen.Domain.Enum;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CesiZen.Domain.Interfaces.Service;

namespace CesiZen.API.Controllers
{
    [Authorize]
    public class UtilisateurController : BaseController
    {
        private readonly IUtilisateurService _utilisateurService;

        public UtilisateurController(IUtilisateurService utilisateurService)
        {
            _utilisateurService = utilisateurService;
        }

        //Récupère le profil de l'utilisateur connecté.
        [HttpGet("me")]
        public async Task<IActionResult> GetMe()
        {
            var id = GetUtilisateurIdFromToken();
            var utilisateur = await _utilisateurService.GetByIdAsync(id);

            return Ok(new UtilisateurResponse
            {
                Id = utilisateur.Id,
                Pseudo = utilisateur.Pseudo,
                Email = utilisateur.Email,
                Role = utilisateur.Role.ToString(),
                EstActif = utilisateur.EstActif,
                DateCreation = utilisateur.DateCreation
            });
        }

        //Met à jour le profil de l'utilisateur connecté.
        [HttpPut("me")]
        public async Task<IActionResult> UpdateMe([FromBody] UpdateUtilisateurRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var id = GetUtilisateurIdFromToken();
            var utilisateur = await _utilisateurService.UpdateAsync(
                id,
                request.Pseudo,
                request.Email);

            return Ok(new UtilisateurResponse
            {
                Id = utilisateur.Id,
                Pseudo = utilisateur.Pseudo,
                Email = utilisateur.Email,
                Role = utilisateur.Role.ToString(),
                EstActif = utilisateur.EstActif,
                DateCreation = utilisateur.DateCreation
            });
        }

        //Change le mot de passe de l'utilisateur connecté.
        [HttpPut("me/mot-de-passe")]
        public async Task<IActionResult> ChangeMotDePasse(
            [FromBody] ChangeMotDePasseRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var id = GetUtilisateurIdFromToken();
            await _utilisateurService.ChangeMotDePasseAsync(
                id,
                request.AncienMotDePasse,
                request.NouveauMotDePasse);

            return Ok(new { message = "Mot de passe modifié avec succès." });
        }


        //Liste tous les utilisateurs.
        [Authorize(Roles = "Administrateur")]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var utilisateurs = await _utilisateurService.GetAllAsync();

            return Ok(utilisateurs.Select(u => new UtilisateurResponse
            {
                Id = u.Id,
                Pseudo = u.Pseudo,
                Email = u.Email,
                Role = u.Role.ToString(),
                EstActif = u.EstActif,
                DateCreation = u.DateCreation
            }));
        }

        //Récupère un utilisateur par son Id.
        [Authorize(Roles = "Administrateur")]
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var utilisateur = await _utilisateurService.GetByIdAsAdminAsync(id);

            return Ok(new UtilisateurResponse
            {
                Id = utilisateur.Id,
                Pseudo = utilisateur.Pseudo,
                Email = utilisateur.Email,
                Role = utilisateur.Role.ToString(),
                EstActif = utilisateur.EstActif,
                DateCreation = utilisateur.DateCreation
            });
        }

        //Modifie un utilisateur (rôle, statut)
        [Authorize(Roles = "Administrateur")]
        [HttpPut("{id:int}")]
        public async Task<IActionResult> AdminUpdate(
            int id,
            [FromBody] AdminUpdateUtilisateurRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var utilisateur = await _utilisateurService.AdminUpdateAsync(
                id,
                request.Pseudo,
                request.Email,
                request.Role,
                request.EstActif);

            return Ok(new UtilisateurResponse
            {
                Id = utilisateur.Id,
                Pseudo = utilisateur.Pseudo,
                Email = utilisateur.Email,
                Role = utilisateur.Role.ToString(),
                EstActif = utilisateur.EstActif,
                DateCreation = utilisateur.DateCreation
            });
        }

        [Authorize(Roles = "Administrateur")]
        [HttpPatch("{id:int}/desactiver")]
        public async Task<IActionResult> Desactiver(int id)
        {
            if (id == GetUtilisateurIdFromToken())
                return BadRequest(new { message = "Vous ne pouvez pas désactiver votre propre compte." });

            await _utilisateurService.DesactiverAsync(id);
            return Ok(new { message = "Compte désactivé avec succès." });
        }

        [Authorize(Roles = "Administrateur")]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Supprimer(int id)
        {
            if (id == GetUtilisateurIdFromToken())
                return BadRequest(new { message = "Vous ne pouvez pas supprimer votre propre compte." });

            await _utilisateurService.SupprimerAsync(id);
            return NoContent();
        }
    }
}
