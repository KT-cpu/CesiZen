using System;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;

namespace CesiZen.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public abstract class BaseController : ControllerBase
    {
        protected int GetUtilisateurIdFromToken()
        {
            var claim = User.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? User.FindFirstValue("sub")
                ?? throw new UnauthorizedAccessException(
                    "Impossible d'identifier l'utilisateur connecté.");

            if (!int.TryParse(claim, out var id))
                throw new UnauthorizedAccessException(
                    "Token invalide.");

            return id;
        }

        protected string GetRoleFromToken()
            => User.FindFirstValue(ClaimTypes.Role)
                ?? throw new UnauthorizedAccessException(
                    "Rôle introuvable dans le token.");
    }
}
