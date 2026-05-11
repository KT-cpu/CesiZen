using CesiZen.API.Services;
using CesiZen.Domain.Entities;
using CesiZen.Domain.Interfaces.Repository;
using Moq;

namespace CesiZen.Tests.Unit;

public class TrackerEmotionServiceTests
{
    [Fact]
    public async Task GetRapportAsync_WithValidPeriod_ReturnsEntriesFromRepository()
    {
        // Arrange
        var debut = new DateTime(2025, 4, 1, 0, 0, 0, DateTimeKind.Utc);
        var fin = new DateTime(2025, 4, 7, 23, 59, 59, DateTimeKind.Utc);

        var entreesAttendues = new List<TrackerEmotion>
        {
            new() { Id = 1, UtilisateurId = 1, Emotion2Id = 1,
                    DateSaisie = debut.AddDays(1) },
            new() { Id = 2, UtilisateurId = 1, Emotion2Id = 2,
                    DateSaisie = debut.AddDays(3) },
        };

        var repoMock = new Mock<ITrackerEmotionRepository>();
        repoMock.Setup(r => r.GetByPeriodeAsync(1, debut, fin))
                .ReturnsAsync(entreesAttendues);

        var service = new TrackerEmotionService(
            repoMock.Object,
            Mock.Of<IEmotion2Repository>());

        // Act
        var (entrees, debutRetour, finRetour) = await service.GetRapportAsync(1, debut, fin);

        // Assert
        var liste = entrees.ToList();
        Assert.Equal(2, liste.Count);
        Assert.Equal(1, liste[0].Id);
        Assert.Equal(2, liste[1].Id);
        Assert.Equal(debut, debutRetour);
        Assert.Equal(fin, finRetour);
        repoMock.Verify(r => r.GetByPeriodeAsync(1, debut, fin), Times.Once);
    }
}