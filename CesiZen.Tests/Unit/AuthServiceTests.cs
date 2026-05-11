using CesiZen.API.Services;
using CesiZen.Domain.Interfaces.Repository;
using Microsoft.Extensions.Configuration;
using Moq;

namespace CesiZen.Tests.Unit;

public class AuthServiceTests
{
    private static AuthService CreateService()
    {
        var config = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["JwtSettings:Secret"] = "test_secret_at_least_32_chars_for_unit_tests",
                ["JwtSettings:Issuer"] = "tests",
                ["JwtSettings:Audience"] = "tests",
                ["JwtSettings:ExpirationMinutes"] = "60",
            })
            .Build();

        var repoMock = new Mock<IUtilisateurRepository>();
        return new AuthService(repoMock.Object, config);
    }

    [Fact]
    public void HashAndVerify_PasswordIsHashedAndVerifiable()
    {
        // Arrange
        var service = CreateService();
        const string password = "Password123!";

        // Act
        var hash = service.HasherMotDePasse(password);
        var matches = service.VerifierMotDePasse(password, hash);
        var doesNotMatch = service.VerifierMotDePasse("WrongPassword!", hash);

        // Assert
        Assert.False(string.IsNullOrEmpty(hash));
        Assert.NotEqual(password, hash);
        Assert.StartsWith("$2", hash);
        Assert.True(matches);
        Assert.False(doesNotMatch);
    }
}