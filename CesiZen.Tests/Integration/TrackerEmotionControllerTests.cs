using System.Net;
using System.Net.Http.Json;
using CesiZen.API.Models.Tracker;
using CesiZen.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace CesiZen.Tests.Integration;

public class TrackerEmotionControllerTests
    : IClassFixture<CesiZenWebApplicationFactory>, IAsyncLifetime
{
    private readonly CesiZenWebApplicationFactory _factory;

    public TrackerEmotionControllerTests(CesiZenWebApplicationFactory factory)
    {
        _factory = factory;
    }

    public Task InitializeAsync() => _factory.ResetDatabaseAsync();
    public Task DisposeAsync() => Task.CompletedTask;

    [Fact]
    public async Task Ajouter_UtilisateurAuthentifie_CreeUneSaisieAssocieeAuToken()
    {
        // Arrange
        var client = await _factory.GetAuthenticatedClientAsync();

        int emotion2Id;
        int utilisateurId;
        using (var scope = _factory.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            emotion2Id = (await db.Emotions2.FirstAsync(e => e.Nom == "Fierté")).Id;
            utilisateurId = (await db.Utilisateurs
                .FirstAsync(u => u.Email == CesiZenWebApplicationFactory.TestUserEmail)).Id;
        }

        var request = new CreateTrackerEmotionRequest
        {
            Emotion2Id = emotion2Id,
            DateSaisie = DateTime.UtcNow,
        };

        // Act
        var response = await client.PostAsJsonAsync("/api/trackeremotion", request);

        // Assert
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);

        using var scope2 = _factory.Services.CreateScope();
        var db2 = scope2.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var saisie = await db2.TrackerEmotions.SingleOrDefaultAsync();

        Assert.NotNull(saisie);
        Assert.Equal(utilisateurId, saisie!.UtilisateurId);
        Assert.Equal(emotion2Id, saisie.Emotion2Id);
    }

    [Fact]
    public async Task Supprimer_UtilisateurAuthentifie_RetireSaSaisieDuJournal()
    {
        // Arrange
        var client = await _factory.GetAuthenticatedClientAsync();

        int emotion2Id;
        using (var scope = _factory.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            emotion2Id = (await db.Emotions2.FirstAsync()).Id;
        }

        var creation = await client.PostAsJsonAsync("/api/trackeremotion",
            new CreateTrackerEmotionRequest { Emotion2Id = emotion2Id });
        var created = await creation.Content.ReadFromJsonAsync<TrackerEmotionResponse>();

        // Act
        var response = await client.DeleteAsync($"/api/trackeremotion/{created!.Id}");

        // Assert
        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);

        using var scope2 = _factory.Services.CreateScope();
        var db2 = scope2.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var existeEncore = await db2.TrackerEmotions.AnyAsync(t => t.Id == created.Id);
        Assert.False(existeEncore);
    }

    [Fact]
    public async Task Journal_Et_Modifier_ParcoursCompletDuneSaisie()
    {
        // Arrange
        var client = await _factory.GetAuthenticatedClientAsync();
        int emotion2Id;
        int autreEmotion2Id;
        using (var scope = _factory.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            var emotions = await db.Emotions2.ToListAsync();
            emotion2Id = emotions[0].Id;
            autreEmotion2Id = emotions[1].Id;
        }

        var creation = await client.PostAsJsonAsync("/api/trackeremotion",
            new CreateTrackerEmotionRequest { Emotion2Id = emotion2Id });
        var saisie = await creation.Content.ReadFromJsonAsync<TrackerEmotionResponse>();

        // Act 1 : GET du journal
        var journalResponse = await client.GetAsync("/api/trackeremotion");
        var journal = await journalResponse.Content
            .ReadFromJsonAsync<List<TrackerEmotionResponse>>();

        // Assert 1
        Assert.Equal(HttpStatusCode.OK, journalResponse.StatusCode);
        Assert.NotNull(journal);
        Assert.Single(journal!);

        // Act 2 : GET d'une saisie par id
        var getByIdResponse = await client.GetAsync($"/api/trackeremotion/{saisie!.Id}");
        Assert.Equal(HttpStatusCode.OK, getByIdResponse.StatusCode);

        // Act 3 : modifier la saisie pour pointer vers une autre émotion
        var update = new UpdateTrackerEmotionRequest
        {
            Emotion2Id = autreEmotion2Id,
            DateSaisie = DateTime.UtcNow,
        };
        var modifResponse = await client.PutAsJsonAsync(
            $"/api/trackeremotion/{saisie.Id}", update);

        // Assert 3
        Assert.Equal(HttpStatusCode.OK, modifResponse.StatusCode);
        var modifie = await modifResponse.Content.ReadFromJsonAsync<TrackerEmotionResponse>();
        Assert.NotNull(modifie);
        Assert.Equal(autreEmotion2Id, modifie!.Emotion2Id);
    }
}