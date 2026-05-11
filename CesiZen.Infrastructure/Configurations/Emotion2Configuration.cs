using CesiZen.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CesiZen.Infrastructure.Configurations
{
    public class Emotion2Configuration : IEntityTypeConfiguration<Emotion2>
    {
        public void Configure(EntityTypeBuilder<Emotion2> builder)
        {
            builder.HasIndex(e => new { e.Emotion1Id, e.Nom }).IsUnique();
            builder.HasIndex(e => e.Emotion1Id);

            builder.Property(e => e.Nom)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(e => e.NomCreateur)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(e => e.DateCreation)
                .IsRequired();

            builder.HasMany(e => e.TrackerEmotions)
                .WithOne(t => t.Emotion2)
                .HasForeignKey(t => t.Emotion2Id)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
