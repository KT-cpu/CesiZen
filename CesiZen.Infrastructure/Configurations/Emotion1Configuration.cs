using CesiZen.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CesiZen.Infrastructure.Configurations
{
    public class Emotion1Configuration : IEntityTypeConfiguration<Emotion1>
    {
        public void Configure(EntityTypeBuilder<Emotion1> builder)
        {
            builder.HasIndex(e => e.Nom).IsUnique();

            builder.Property(e => e.Nom)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(e => e.NomCreateur)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(e => e.DateCreation)
                .IsRequired();

            builder.HasMany(e => e.Emotions2)
                .WithOne(e2 => e2.Emotion1)
                .HasForeignKey(e2 => e2.Emotion1Id)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
