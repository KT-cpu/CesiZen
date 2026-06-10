using CesiZen.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CesiZen.Infrastructure.Configurations
{
    public class TrackerEmotionConfiguration : IEntityTypeConfiguration<TrackerEmotion>
    {
        public void Configure(EntityTypeBuilder<TrackerEmotion> builder)
        {
            builder.HasIndex(t => new { t.UtilisateurId, t.DateSaisie });
            builder.HasIndex(t => t.Emotion2Id);

            builder.Property(t => t.DateSaisie)
                .IsRequired();

            builder.HasQueryFilter(t => t.Utilisateur.EstActif);
        }
    }
}