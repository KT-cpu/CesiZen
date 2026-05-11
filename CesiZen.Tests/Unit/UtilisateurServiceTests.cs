using CesiZen.API.Services;
using CesiZen.Domain.Entities;
using CesiZen.Domain.Enum;
using CesiZen.Domain.Interfaces.Repository;
using CesiZen.Domain.Interfaces.Service;
using Moq;

namespace CesiZen.Tests.Unit;

public class UtilisateurServiceTests
{
    [Fact]
    public async Task UpdateAsync_WithExistingPseudo_ThrowsInvalidOperationException()
    {
        // Arrange
        var existant = new Utilisateur
        {
            Id = 1,
            Pseudo = "Bob",
            Email = "bob@test.fr",
            MotDePasseHash = "hash",
            Role = RoleUtilisateur.Utilisateur,
            EstActif = true,
            DateCreation = DateTime.UtcNow,
        };

        var repoMock = new Mock<IUtilisateurRepository>();
        repoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(existant);
        repoMock.Setup(r => r.PseudoExistsAsync("Alice")).ReturnsAsync(true);

        var authMock = new Mock<IAuthService>();
        var service = new UtilisateurService(repoMock.Object, authMock.Object);

        // Act + Assert
        var ex = await Assert.ThrowsAsync<InvalidOperationException>(
            () => service.UpdateAsync(1, "Alice", null));

        Assert.Contains("pseudo", ex.Message, StringComparison.OrdinalIgnoreCase);
        Assert.Contains("déjà", ex.Message);

        repoMock.Verify(r => r.SaveChangesAsync(), Times.Never);
    }
}