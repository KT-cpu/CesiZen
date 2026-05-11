using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using CesiZen.API.Models.Emotion;
using CesiZen.Domain.Interfaces.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CesiZen.API.Controllers
{
    public class EmotionController : BaseController
    {
        private readonly IEmotionService _emotionService;

        public EmotionController(IEmotionService emotionService)
        {
            _emotionService = emotionService;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var emotions1 = await _emotionService.GetAllEmotions1Async();

            return Ok(emotions1.Select(e => new Emotion1Response
            {
                Id = e.Id,
                Nom = e.Nom,
                NomCreateur = e.NomCreateur,
                DateCreation = e.DateCreation,
                Emotions2 = e.Emotions2.Select(e2 => new Emotion2Response
                {
                    Id = e2.Id,
                    Nom = e2.Nom,
                    NomCreateur = e2.NomCreateur,
                    DateCreation = e2.DateCreation,
                    Emotion1Id = e2.Emotion1Id,
                    Emotion1Nom = e.Nom
                }).ToList()
            }));
        }

        [AllowAnonymous]
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetEmotion1ById(int id)
        {
            var emotion1 = await _emotionService.GetEmotion1ByIdAsync(id);

            return Ok(new Emotion1Response
            {
                Id = emotion1.Id,
                Nom = emotion1.Nom,
                NomCreateur = emotion1.NomCreateur,
                DateCreation = emotion1.DateCreation,
                Emotions2 = emotion1.Emotions2.Select(e2 => new Emotion2Response
                {
                    Id = e2.Id,
                    Nom = e2.Nom,
                    NomCreateur = e2.NomCreateur,
                    DateCreation = e2.DateCreation,
                    Emotion1Id = e2.Emotion1Id,
                    Emotion1Nom = emotion1.Nom
                }).ToList()
            });
        }

        [AllowAnonymous]
        [HttpGet("sous-emotion/{id:int}")]
        public async Task<IActionResult> GetEmotion2ById(int id)
        {
            var emotion2 = await _emotionService.GetEmotion2ByIdAsync(id);

            return Ok(new Emotion2Response
            {
                Id = emotion2.Id,
                Nom = emotion2.Nom,
                NomCreateur = emotion2.NomCreateur,
                DateCreation = emotion2.DateCreation,
                Emotion1Id = emotion2.Emotion1Id,
                Emotion1Nom = emotion2.Emotion1?.Nom ?? string.Empty
            });
        }

        [Authorize(Roles = "Administrateur")]
        [HttpPost]
        public async Task<IActionResult> CreerEmotion1([FromBody] CreateEmotion1Request request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var nomCreateur = User.FindFirstValue(ClaimTypes.Email)
                ?? "Administrateur";

            var emotion1 = await _emotionService.CreerEmotion1Async(
                request.Nom,
                nomCreateur);

            var response = new Emotion1Response
            {
                Id = emotion1.Id,
                Nom = emotion1.Nom,
                NomCreateur = emotion1.NomCreateur,
                DateCreation = emotion1.DateCreation,
                Emotions2 = new()
            };

            return CreatedAtAction(nameof(GetEmotion1ById), new { id = emotion1.Id }, response);
        }

        [Authorize(Roles = "Administrateur")]
        [HttpPost("sous-emotion")]
        public async Task<IActionResult> CreerEmotion2([FromBody] CreateEmotion2Request request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var nomCreateur = User.FindFirstValue(ClaimTypes.Email)
                ?? "Administrateur";

            var emotion2 = await _emotionService.CreerEmotion2Async(
                request.Nom,
                nomCreateur,
                request.Emotion1Id);

            var response = new Emotion2Response
            {
                Id = emotion2.Id,
                Nom = emotion2.Nom,
                NomCreateur = emotion2.NomCreateur,
                DateCreation = emotion2.DateCreation,
                Emotion1Id = emotion2.Emotion1Id,
                Emotion1Nom = emotion2.Emotion1?.Nom ?? string.Empty
            };

            return CreatedAtAction(
                nameof(GetEmotion2ById),
                new { id = emotion2.Id },
                response);
        }

        [Authorize(Roles = "Administrateur")]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> SupprimerEmotion1(int id)
        {
            await _emotionService.SupprimerEmotion1Async(id);
            return NoContent();
        }

        [Authorize(Roles = "Administrateur")]
        [HttpDelete("sous-emotion/{id:int}")]
        public async Task<IActionResult> SupprimerEmotion2(int id)
        {
            await _emotionService.SupprimerEmotion2Async(id);
            return NoContent();
        }
    }
}
