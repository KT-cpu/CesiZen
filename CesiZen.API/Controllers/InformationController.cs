using System.Linq;
using System.Threading.Tasks;
using CesiZen.API.Models.Information;
using CesiZen.Domain.Interfaces.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CesiZen.API.Controllers
{
    public class InformationController : BaseController
    {
        private readonly IInformationService _informationService;

        public InformationController(IInformationService informationService)
        {
            _informationService = informationService;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var informations = await _informationService.GetAllAsync();

            return Ok(informations.Select(i => new InformationResponse
            {
                Id = i.Id,
                Titre = i.Titre,
                Type = i.Type,
                Contenu = i.Contenu,
                DateCreation = i.DateCreation,
                DateModification = i.DateModification
            }));
        }

        [AllowAnonymous]
        [HttpGet("type/{type}")]
        public async Task<IActionResult> GetByType(string type)
        {
            var informations = await _informationService.GetByTypeAsync(type);

            return Ok(informations.Select(i => new InformationResponse
            {
                Id = i.Id,
                Titre = i.Titre,
                Type = i.Type,
                Contenu = i.Contenu,
                DateCreation = i.DateCreation,
                DateModification = i.DateModification
            }));
        }

        [AllowAnonymous]
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var information = await _informationService.GetByIdAsync(id);

            return Ok(new InformationResponse
            {
                Id = information.Id,
                Titre = information.Titre,
                Type = information.Type,
                Contenu = information.Contenu,
                DateCreation = information.DateCreation,
                DateModification = information.DateModification
            });
        }

        [Authorize(Roles = "Administrateur")]
        [HttpPost]
        public async Task<IActionResult> Creer([FromBody] CreateInformationRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var information = await _informationService.CreerAsync(
                request.Titre,
                request.Type,
                request.Contenu);

            var response = new InformationResponse
            {
                Id = information.Id,
                Titre = information.Titre,
                Type = information.Type,
                Contenu = information.Contenu,
                DateCreation = information.DateCreation,
                DateModification = information.DateModification
            };

            return CreatedAtAction(nameof(GetById), new { id = information.Id }, response);
        }

        [Authorize(Roles = "Administrateur")]
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Modifier(
            int id,
            [FromBody] UpdateInformationRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var information = await _informationService.ModifierAsync(
                id,
                request.Titre,
                request.Type,
                request.Contenu);

            return Ok(new InformationResponse
            {
                Id = information.Id,
                Titre = information.Titre,
                Type = information.Type,
                Contenu = information.Contenu,
                DateCreation = information.DateCreation,
                DateModification = information.DateModification
            });
        }

        [Authorize(Roles = "Administrateur")]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Supprimer(int id)
        {
            await _informationService.SupprimerAsync(id);
            return NoContent();
        }
    }
}
