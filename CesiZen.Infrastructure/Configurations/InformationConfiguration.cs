using CesiZen.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CesiZen.Infrastructure.Configurations
{
    public class InformationConfiguration : IEntityTypeConfiguration<Information>
    {
        public void Configure(EntityTypeBuilder<Information> builder)
        {
            builder.HasIndex(i => i.Type);

            builder.Property(i => i.Titre)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(i => i.Type)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(i => i.Contenu)
                .IsRequired();

            builder.Property(i => i.DateCreation)
                .IsRequired();

            builder.Property(i => i.DateModification)
                .IsRequired();
        }
    }
}