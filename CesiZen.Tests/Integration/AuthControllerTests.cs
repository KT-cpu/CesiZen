using System.Net;
using System.Net.Http.Json;
using CesiZen.API.Models.Auth;
using CesiZen.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace CesiZen.Tests.Integration;

public class AuthControllerTests : IClassFixture<CesiZenWebApplicationFactory>, IAsyncLifetime
{
    private readonly CesiZenWebApplicationFactory _factory;

    public AuthControllerTests(CesiZenWebApplicationFactory factory)
    {
        _factory = factory;
    }

    public Task InitializeAsync() => _factory.ResetDatabaseAsync();
    public Task DisposeAsync() => Task.CompletedTask;

    [Fact]
    public async Task Register_AvecDonneesValides_RetourneCreatedEtPersisteUtilisateur()
    {
        // Arrange
        var client = _factory.CreateClient();
        var request = new RegisterRequest
        {
            Pseudo = "NouveauVenu",
            Email = "nouveau@cesizen.test",
            MotDePasse = "Password123!",
            ConfirmationMotDePasse = "Password123!",
        };

        // Act
        var response = await client.PostAsJsonAsync("/api/auth/register", request);

        // Assert
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);

        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var utilisateurEnBdd = await db.Utilisateurs
            .SingleOrDefaultAsync(u => u.Email == "nouveau@cesizen.test");

        Assert.NotNull(utilisateurEnBdd);
        Assert.Equal("NouveauVenu", utilisateurEnBdd!.Pseudo);
        Assert.StartsWith("$2", utilisateurEnBdd.MotDePasseHash); // signature BCrypt
        Assert.NotEqual("Password123!", utilisateurEnBdd.MotDePasseHash);
    }

    [Fact]
    public async Task Login_AvecIdentifiantsValides_RetourneTokenJWT()
    {
        // Arrange
        var client = _factory.CreateClient();
        var request = new LoginRequest
        {
            Email = CesiZenWebApplicationFactory.TestUserEmail,
            MotDePasse = CesiZenWebApplicationFactory.TestUserPassword,
        };

        // Act
        var response = await client.PostAsJsonAsync("/api/auth/login", request);

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var auth = await response.Content.ReadFromJsonAsync<AuthResponse>();

        Assert.NotNull(auth);
        Assert.False(string.IsNullOrEmpty(auth!.Token));
        Assert.Equal(3, auth.Token.Split('.').Length);
        Assert.Equal("UserTest", auth.Pseudo);
        Assert.Equal("Utilisateur", auth.Role);
        Assert.True(auth.Expiration > DateTime.UtcNow);
    }

    [Fact]
    public async Task Login_AvecMauvaisMotDePasse_RetourneUnauthorizedSansFuiteDInfo()
    {
        // Arrange
        var client = _factory.CreateClient();
        var request = new LoginRequest
        {
            Email = CesiZenWebApplicationFactory.TestUserEmail,
            MotDePasse = "MauvaisPassword123!", // mauvais mot de passe
        };

        // Act
        var response = await client.PostAsJsonAsync("/api/auth/login", request);

        // Assert
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);

        var body = await response.Content.ReadAsStringAsync();
        Assert.DoesNotContain("introuvable", body, StringComparison.OrdinalIgnoreCase);
        Assert.DoesNotContain("inexistant", body, StringComparison.OrdinalIgnoreCase);

    }
}