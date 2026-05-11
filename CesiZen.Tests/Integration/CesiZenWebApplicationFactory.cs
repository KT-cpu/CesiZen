using System.Net.Http.Headers;
using System.Net.Http.Json;
using BCrypt.Net;
using CesiZen.API.Models.Auth;
using CesiZen.Domain.Entities;
using CesiZen.Domain.Enum;
using CesiZen.API;
using CesiZen.Infrastructure.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;

namespace CesiZen.Tests.Integration;

public class CesiZenWebApplicationFactory : WebApplicationFactory<Program>, IAsyncLifetime
{
    public const string TestUserEmail = "user@cesizen.test";
    public const string TestUserPassword = "Password123!";
    public const string TestAdminEmail = "admin@cesizen.test";
    public const string TestAdminPassword = "AdminTest123!";

    private readonly SqliteConnection _connection;

    public CesiZenWebApplicationFactory()
    {
        Environment.SetEnvironmentVariable("ASPNETCORE_ENVIRONMENT", "Testing");
        Environment.SetEnvironmentVariable(
            "JwtSettings__Secret",
            "test_secret_key_at_least_32_characters_long_for_jwt_signing_in_tests");
        Environment.SetEnvironmentVariable("JwtSettings__Issuer", "CesiZen.Tests");
        Environment.SetEnvironmentVariable("JwtSettings__Audience", "CesiZen.Tests");
        Environment.SetEnvironmentVariable("JwtSettings__ExpirationMinutes", "60");
        Environment.SetEnvironmentVariable("Cors__OriginesAutorisees__0", "http://localhost:5173");
        Environment.SetEnvironmentVariable("Seed__AdminPassword", TestAdminPassword);

        _connection = new SqliteConnection("Data Source=:memory:");
        _connection.Open();
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");

        builder.ConfigureTestServices(services =>
        {

            var descriptorsEfCore = services
                .Where(d =>
                    d.ServiceType == typeof(DbContextOptions<ApplicationDbContext>) ||
                    d.ServiceType == typeof(DbContextOptions) ||
                    (d.ServiceType.FullName?.Contains("EntityFrameworkCore") == true))
                .ToList();

            foreach (var descriptor in descriptorsEfCore)
                services.Remove(descriptor);

            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlite(_connection));
        });
    }

    public async Task InitializeAsync()
    {
        await ResetDatabaseAsync();
    }

    public async Task ResetDatabaseAsync()
    {
        using var scope = Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        await db.Database.EnsureDeletedAsync();
        await db.Database.EnsureCreatedAsync();
        await SeedAsync(db);
    }

    private static async Task SeedAsync(ApplicationDbContext db)
    {
        var admin = new Utilisateur
        {
            Pseudo = "AdminTest",
            Email = TestAdminEmail,
            MotDePasseHash = BCrypt.Net.BCrypt.HashPassword(TestAdminPassword, 12),
            Role = RoleUtilisateur.Administrateur,
            EstActif = true,
            DateCreation = DateTime.UtcNow,
        };
        var user = new Utilisateur
        {
            Pseudo = "UserTest",
            Email = TestUserEmail,
            MotDePasseHash = BCrypt.Net.BCrypt.HashPassword(TestUserPassword, 12),
            Role = RoleUtilisateur.Utilisateur,
            EstActif = true,
            DateCreation = DateTime.UtcNow,
        };
        db.Utilisateurs.AddRange(admin, user);

        var joie = new Emotion1
        {
            Nom = "Joie",
            NomCreateur = "system",
            DateCreation = DateTime.UtcNow,
        };
        var colere = new Emotion1
        {
            Nom = "Colère",
            NomCreateur = "system",
            DateCreation = DateTime.UtcNow,
        };
        db.Emotions1.AddRange(joie, colere);

        await db.SaveChangesAsync();

        db.Emotions2.AddRange(
            new Emotion2
            {
                Nom = "Fierté",
                Emotion1Id = joie.Id,
                NomCreateur = "system",
                DateCreation = DateTime.UtcNow,
            },
            new Emotion2
            {
                Nom = "Frustration",
                Emotion1Id = colere.Id,
                NomCreateur = "system",
                DateCreation = DateTime.UtcNow,
            });

        db.Informations.AddRange(
            new Information
            {
                Titre = "Comprendre le stress",
                Type = "Article",
                Contenu = "Le stress est une réaction naturelle...",
                DateCreation = DateTime.UtcNow,
                DateModification = DateTime.UtcNow,
            },
            new Information
            {
                Titre = "La cohérence cardiaque",
                Type = "Guide",
                Contenu = "Technique de respiration en 5-5...",
                DateCreation = DateTime.UtcNow,
                DateModification = DateTime.UtcNow,
            },
            new Information
            {
                Titre = "Sommeil et santé mentale",
                Type = "Article",
                Contenu = "Le sommeil est un pilier...",
                DateCreation = DateTime.UtcNow,
                DateModification = DateTime.UtcNow,
            });

        await db.SaveChangesAsync();
    }

    public async Task<HttpClient> GetAuthenticatedClientAsync(bool admin = false)
    {
        var client = CreateClient();
        var login = new LoginRequest
        {
            Email = admin ? TestAdminEmail : TestUserEmail,
            MotDePasse = admin ? TestAdminPassword : TestUserPassword,
        };

        var response = await client.PostAsJsonAsync("/api/auth/login", login);
        response.EnsureSuccessStatusCode();

        var auth = await response.Content.ReadFromJsonAsync<AuthResponse>();
        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", auth!.Token);

        return client;
    }

    public new async Task DisposeAsync()
    {
        await _connection.DisposeAsync();
        await base.DisposeAsync();
    }
}