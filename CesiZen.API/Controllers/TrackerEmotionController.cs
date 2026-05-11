using System;
using System.Linq;
using System.Threading.Tasks;
using CesiZen.API.Models.Tracker;
using CesiZen.Domain.Interfaces.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CesiZen.API.Controllers
{
    [Authorize]
    public class TrackerEmotionController : BaseController
    {
        private readonly ITrackerEmotionService _trackerService;

        public TrackerEmotionController(ITrackerEmotionService trackerService)
        {
            _trackerService = trackerService;
        }

        [HttpGet]
        public async Task<IActionResult> GetJournal()
        {
            var utilisateurId = GetUtilisateurIdFromToken();
            var entrees = await _trackerService.GetJournalAsync(utilisateurId);

            return Ok(entrees.Select(t => new TrackerEmotionResponse
            {
                Id = t.Id,
                DateSaisie = t.DateSaisie,
                Emotion2Id = t.Emotion2Id,
                Emotion2Nom = t.Emotion2?.Nom ?? string.Empty,
                Emotion1Id = t.Emotion2?.Emotion1Id ?? 0,
                Emotion1Nom = t.Emotion2?.Emotion1?.Nom ?? string.Empty
            }));
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var utilisateurId = GetUtilisateurIdFromToken();
            var tracker = await _trackerService.GetByIdAsync(id, utilisateurId);

            return Ok(new TrackerEmotionResponse
            {
                Id = tracker.Id,
                DateSaisie = tracker.DateSaisie,
                Emotion2Id = tracker.Emotion2Id,
                Emotion2Nom = tracker.Emotion2?.Nom ?? string.Empty,
                Emotion1Id = tracker.Emotion2?.Emotion1Id ?? 0,
                Emotion1Nom = tracker.Emotion2?.Emotion1?.Nom ?? string.Empty
            });
        }

        [HttpPost]
        public async Task<IActionResult> Ajouter([FromBody] CreateTrackerEmotionRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var utilisateurId = GetUtilisateurIdFromToken();
            var tracker = await _trackerService.AjouterAsync(
                utilisateurId,
                request.Emotion2Id,
                request.DateSaisie);

            var response = new TrackerEmotionResponse
            {
                Id = tracker.Id,
                DateSaisie = tracker.DateSaisie,
                Emotion2Id = tracker.Emotion2Id,
                Emotion2Nom = tracker.Emotion2?.Nom ?? string.Empty,
                Emotion1Id = tracker.Emotion2?.Emotion1Id ?? 0,
                Emotion1Nom = tracker.Emotion2?.Emotion1?.Nom ?? string.Empty
            };

            return CreatedAtAction(nameof(GetById), new { id = tracker.Id }, response);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Modifier(
            int id,
            [FromBody] UpdateTrackerEmotionRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var utilisateurId = GetUtilisateurIdFromToken();
            var tracker = await _trackerService.ModifierAsync(
                id,
                utilisateurId,
                request.Emotion2Id,
                request.DateSaisie);

            return Ok(new TrackerEmotionResponse
            {
                Id = tracker.Id,
                DateSaisie = tracker.DateSaisie,
                Emotion2Id = tracker.Emotion2Id,
                Emotion2Nom = tracker.Emotion2?.Nom ?? string.Empty,
                Emotion1Id = tracker.Emotion2?.Emotion1Id ?? 0,
                Emotion1Nom = tracker.Emotion2?.Emotion1?.Nom ?? string.Empty
            });
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Supprimer(int id)
        {
            var utilisateurId = GetUtilisateurIdFromToken();
            await _trackerService.SupprimerAsync(id, utilisateurId);
            return NoContent();
        }

        [HttpGet("rapport")]
        public async Task<IActionResult> GetRapport([FromQuery] RapportEmotionRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var utilisateurId = GetUtilisateurIdFromToken();
            var (entrees, debut, fin) = await _trackerService.GetRapportAsync(
                utilisateurId,
                request.Debut,
                request.Fin);

            var liste = entrees.ToList();

            //Calcul des statistiques par émotion de base
            var stats = liste
                .GroupBy(t => new
                {
                    Id = t.Emotion2?.Emotion1Id ?? 0,
                    Nom = t.Emotion2?.Emotion1?.Nom ?? "Inconnue"
                })
                .Select(g => new EmotionStat
                {
                    Emotion1Nom = g.Key.Nom,
                    NombreOccurrences = g.Count(),
                    Pourcentage = liste.Count > 0
                        ? Math.Round((double)g.Count() / liste.Count * 100, 2)
                        : 0
                })
                .OrderByDescending(s => s.NombreOccurrences)
                .ToList();

            return Ok(new RapportEmotionResponse
            {
                Debut = debut,
                Fin = fin,
                TotalEntrees = liste.Count,
                StatistiquesParEmotion1 = stats,
                Entrees = liste.Select(t => new TrackerEmotionResponse
                {
                    Id = t.Id,
                    DateSaisie = t.DateSaisie,
                    Emotion2Id = t.Emotion2Id,
                    Emotion2Nom = t.Emotion2?.Nom ?? string.Empty,
                    Emotion1Id = t.Emotion2?.Emotion1Id ?? 0,
                    Emotion1Nom = t.Emotion2?.Emotion1?.Nom ?? string.Empty
                }).ToList()
            });
        }
    }
}
