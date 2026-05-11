using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CesiZen.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FixEmotion2UniqueIndex : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Emotions2_Nom",
                table: "Emotions2");

            migrationBuilder.CreateIndex(
                name: "IX_Emotions2_Emotion1Id_Nom",
                table: "Emotions2",
                columns: new[] { "Emotion1Id", "Nom" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Emotions2_Emotion1Id_Nom",
                table: "Emotions2");

            migrationBuilder.CreateIndex(
                name: "IX_Emotions2_Nom",
                table: "Emotions2",
                column: "Nom",
                unique: true);
        }
    }
}
