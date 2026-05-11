using CesiZen.Domain.Entities;
using CesiZen.Domain.Enum;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CesiZen.Infrastructure.Configurations
{
    public class UtilisateurConfiguration : IEntityTypeConfiguration<Utilisateur>
    {
        public void Configure(EntityTypeBuilder<Utilisateur> builder)
        {
            builder.HasIndex(u => u.Email).IsUnique();
            builder.HasIndex(u => u.Pseudo).IsUnique();
            builder.HasIndex(u => u.EstActif);

            builder.Property(u => u.Email)
                .IsRequired()
                .HasMaxLength(254)
                .HasConversion(
                    v => v.ToLowerInvariant(),
                    v => v);

            builder.Property(u => u.Pseudo)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(u => u.MotDePasseHash)
                .IsRequired()
                .HasMaxLength(256);

            builder.Property(u => u.Role)
                .IsRequired()
                .HasConversion<int>();

            builder.Property(u => u.EstActif)
                .IsRequired()
                .HasDefaultValue(true);

            builder.Property(u => u.DateCreation)
                .IsRequired();

            builder.HasQueryFilter(u => u.EstActif);

            builder.HasMany(u => u.TrackerEmotions)
                .WithOne(t => t.Utilisateur)
                .HasForeignKey(t => t.UtilisateurId)
                .OnDelete(DeleteBehavior.Cascade);

        }
    }
}
