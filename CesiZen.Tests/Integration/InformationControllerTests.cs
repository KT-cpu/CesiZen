using System.Net;
using System.Net.Http.Json;
using CesiZen.API.Models.Information;
using CesiZen.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace CesiZen.Tests.Integration;

public class InformationControllerTests
    : IClassFixture<CesiZenWebApplicationFactory>, IAsyncLifetime
{
    private readonly CesiZenWebApplicationFactory _factory;

    public InformationControllerTests(CesiZenWebApplicationFactory factory)
    {
        _factory = factory;
    }

    public Task InitializeAsync() => _factory.ResetDatabaseAsync();
    public Task DisposeAsync() => Task.CompletedTask;

    [Fact]
    public async Task GetAll_VisiteurAnonyme_RetourneListePublique()
    {
        // Arrange
        var client = _factory.CreateClient();

        // Act
        var response = await client.GetAsync("/api/information");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var infos = await response.Content.ReadFromJsonAsync<List<InformationResponse>>();
        Assert.NotNull(infos);
        Assert.Equal(3, infos!.Count);
        Assert.Contains(infos, i => i.Titre == "Comprendre le stress");
    }

    [Fact]
    public async Task Creer_Administrateur_AjouteUnArticleEtRetourneCreated()
    {
        // Arrange
        var adminClient = await _factory.GetAuthenticatedClientAsync(admin: true);
        var request = new CreateInformationRequest
        {
            Titre = "Méditation guidée",
            Type = "Vidéo",
            Contenu = "Une séance de 10 minutes pour débutants...",
        };

        // Act
        var response = await adminClient.PostAsJsonAsync("/api/information", request);

        // Assert
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);

        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var total = await db.Informations.CountAsync();
        Assert.Equal(4, total);

        var created = await db.Informations
            .SingleOrDefaultAsync(i => i.Titre == "Méditation guidée");
        Assert.NotNull(created);
        Assert.Equal("Vidéo", created!.Type);
    }

    [Fact]
    public async Task Information_ParcoursCompletCRUDParAdmin()
    {
        // Arrange
        var anonymeClient = _factory.CreateClient();
        var adminClient = await _factory.GetAuthenticatedClientAsync(admin: true);

        // Act 1 : GET /api/information/type/{type} - filtre public par type
        var byTypeResponse = await anonymeClient.GetAsync("/api/information/type/Article");
        Assert.Equal(HttpStatusCode.OK, byTypeResponse.StatusCode);

        var articles = await byTypeResponse.Content
            .ReadFromJsonAsync<List<InformationResponse>>();
        Assert.NotNull(articles);
        Assert.All(articles!, i => Assert.Equal("Article", i.Type));

        var infoCible = articles.First();

        // Act 2 : GET /api/information/{id} - détail public
        var detailResponse = await anonymeClient.GetAsync(
            $"/api/information/{infoCible.Id}");
        Assert.Equal(HttpStatusCode.OK, detailResponse.StatusCode);

        // Act 3 : PUT /api/information/{id} - modification par admin
        var update = new UpdateInformationRequest
        {
            Titre = "Titre modifié",
            Type = "Article",
            Contenu = "Contenu mis à jour pour les besoins du test.",
        };
        var updateResponse = await adminClient.PutAsJsonAsync(
            $"/api/information/{infoCible.Id}", update);
        Assert.Equal(HttpStatusCode.OK, updateResponse.StatusCode);

        var modifiee = await updateResponse.Content
            .ReadFromJsonAsync<InformationResponse>();
        Assert.Equal("Titre modifié", modifiee!.Titre);

        // Act 4 : DELETE /api/information/{id} - suppression par admin
        var deleteResponse = await adminClient.DeleteAsync(
            $"/api/information/{infoCible.Id}");
        Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);

        // Act 5 : vérifie que l'info supprimée n'apparaît plus
        var apresSuppression = await anonymeClient.GetAsync("/api/information");
        var restantes = await apresSuppression.Content
            .ReadFromJsonAsync<List<InformationResponse>>();
        Assert.DoesNotContain(restantes!, i => i.Id == infoCible.Id);
    }
}