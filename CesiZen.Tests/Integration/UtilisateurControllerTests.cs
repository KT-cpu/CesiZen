using System.Net;
using System.Net.Http.Json;
using CesiZen.API.Models.Utilisateur;
using CesiZen.Domain.Enum;

namespace CesiZen.Tests.Integration;

public class UtilisateurControllerTests
    : IClassFixture<CesiZenWebApplicationFactory>, IAsyncLifetime
{
    private readonly CesiZenWebApplicationFactory _factory;

    public UtilisateurControllerTests(CesiZenWebApplicationFactory factory)
    {
        _factory = factory;
    }

    public Task InitializeAsync() => _factory.ResetDatabaseAsync();
    public Task DisposeAsync() => Task.CompletedTask;

    [Fact]
    public async Task GetMe_UtilisateurAuthentifie_RetourneSonProfil()
    {
        // Arrange
        var client = await _factory.GetAuthenticatedClientAsync();

        // Act
        var response = await client.GetAsync("/api/utilisateur/me");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var profil = await response.Content.ReadFromJsonAsync<UtilisateurResponse>();
        Assert.NotNull(profil);
        Assert.Equal(CesiZenWebApplicationFactory.TestUserEmail, profil!.Email);
        Assert.Equal("UserTest", profil.Pseudo);
        Assert.Equal("Utilisateur", profil.Role);
        Assert.True(profil.EstActif);

        // Sécurité : aucun champ sensible
        var raw = await response.Content.ReadAsStringAsync();
        Assert.DoesNotContain("MotDePasseHash", raw);
        Assert.DoesNotContain("$2", raw);
    }

    [Fact]
    public async Task AdminEndpoints_ParcoursCompletDeGestionDunUtilisateur()
    {
        // Arrange
        var adminClient = await _factory.GetAuthenticatedClientAsync(admin: true);

        // Act 1 : GET /api/utilisateur
        var listResponse = await adminClient.GetAsync("/api/utilisateur");
        Assert.Equal(HttpStatusCode.OK, listResponse.StatusCode);

        var users = await listResponse.Content
            .ReadFromJsonAsync<List<UtilisateurResponse>>();
        Assert.NotNull(users);
        Assert.Equal(2, users!.Count); // admin + user seedés

        var cibleId = users.Single(u => u.Pseudo == "UserTest").Id;

        // Act 2 : GET /api/utilisateur/{id}
        var getByIdResponse = await adminClient.GetAsync($"/api/utilisateur/{cibleId}");
        Assert.Equal(HttpStatusCode.OK, getByIdResponse.StatusCode);

        // Act 3 : PUT /api/utilisateur/{id}
        var update = new AdminUpdateUtilisateurRequest
        {
            Role = RoleUtilisateur.Administrateur,
        };
        var updateResponse = await adminClient.PutAsJsonAsync(
            $"/api/utilisateur/{cibleId}", update);
        Assert.Equal(HttpStatusCode.OK, updateResponse.StatusCode);

        var miseAJour = await updateResponse.Content
            .ReadFromJsonAsync<UtilisateurResponse>();
        Assert.Equal("Administrateur", miseAJour!.Role);

        // Act 4 : PATCH /api/utilisateur/{id}/desactiver
        var desactivResponse = await adminClient.PatchAsync(
            $"/api/utilisateur/{cibleId}/desactiver", null);
        Assert.Equal(HttpStatusCode.OK, desactivResponse.StatusCode);

        // Act 5 : vérifie que le compte est désactivé
        var apresDesactivation = await adminClient.GetAsync(
            $"/api/utilisateur/{cibleId}");
        var profil = await apresDesactivation.Content
            .ReadFromJsonAsync<UtilisateurResponse>();
        Assert.False(profil!.EstActif);
    }
}