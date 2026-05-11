using System.Net;
using System.Net.Http.Json;
using CesiZen.API.Models.Emotion;
using CesiZen.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace CesiZen.Tests.Integration;

public class EmotionControllerTests
    : IClassFixture<CesiZenWebApplicationFactory>, IAsyncLifetime
{
    private readonly CesiZenWebApplicationFactory _factory;

    public EmotionControllerTests(CesiZenWebApplicationFactory factory)
    {
        _factory = factory;
    }

    public Task InitializeAsync() => _factory.ResetDatabaseAsync();
    public Task DisposeAsync() => Task.CompletedTask;

    [Fact]
    public async Task GetAll_VisiteurAnonyme_RetourneEmotionsAvecSousEmotions()
    {
        // Arrange
        var client = _factory.CreateClient();

        // Act
        var response = await client.GetAsync("/api/emotion");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var emotions = await response.Content.ReadFromJsonAsync<List<Emotion1Response>>();
        Assert.NotNull(emotions);
        Assert.Equal(2, emotions!.Count);
        Assert.Contains(emotions, e => e.Nom == "Joie");

        var joie = emotions.First(e => e.Nom == "Joie");
        Assert.Contains(joie.Emotions2, e2 => e2.Nom == "Fierté");
    }

    [Fact]
    public async Task CreerEmotion1_Administrateur_AjouteUneNouvelleEmotionDeBase()
    {
        // Arrange
        var adminClient = await _factory.GetAuthenticatedClientAsync(admin: true);
        var request = new CreateEmotion1Request { Nom = "Sérénité" };

        // Act
        var response = await adminClient.PostAsJsonAsync("/api/emotion", request);

        // Assert
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var created = await response.Content.ReadFromJsonAsync<Emotion1Response>();
        Assert.NotNull(created);
        Assert.Equal("Sérénité", created!.Nom);
        Assert.True(created.Id > 0);
    }

    [Fact]
    public async Task SousEmotion_CreationPuisSuppressionCascade()
    {
        // Arrange
        var anonymeClient = _factory.CreateClient();
        var adminClient = await _factory.GetAuthenticatedClientAsync(admin: true);

        int emotion1Id;
        using (var scope = _factory.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            emotion1Id = (await db.Emotions1.FirstAsync(e => e.Nom == "Joie")).Id;
        }

        // Act 1 : création d'une sous-émotion (admin)
        var creationResponse = await adminClient.PostAsJsonAsync(
            "/api/emotion/sous-emotion",
            new CreateEmotion2Request
            {
                Nom = "Sérénité",
                Emotion1Id = emotion1Id,
            });

        Assert.Equal(HttpStatusCode.Created, creationResponse.StatusCode);
        var creee = await creationResponse.Content
            .ReadFromJsonAsync<Emotion2Response>();
        Assert.NotNull(creee);
        Assert.Equal("Sérénité", creee!.Nom);

        // Act 2 : GET /api/emotion/{id} - récupère l'émotion 1 par son id
        var getEmotion1Response = await anonymeClient.GetAsync(
            $"/api/emotion/{emotion1Id}");
        Assert.Equal(HttpStatusCode.OK, getEmotion1Response.StatusCode);

        // Act 3 : GET /api/emotion/sous-emotion/{id} - récupère la sous-émotion
        var getEmotion2Response = await anonymeClient.GetAsync(
            $"/api/emotion/sous-emotion/{creee.Id}");
        Assert.Equal(HttpStatusCode.OK, getEmotion2Response.StatusCode);

        // Act 4 : DELETE /api/emotion/sous-emotion/{id} - suppression
        var deleteResponse = await adminClient.DeleteAsync(
            $"/api/emotion/sous-emotion/{creee.Id}");
        Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);
    }
}