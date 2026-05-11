using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CesiZen.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ChangeFkCascadeForUserAndEmotionDeletion : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TrackerEmotions_Emotions2_Emotion2Id",
                table: "TrackerEmotions");

            migrationBuilder.DropForeignKey(
                name: "FK_TrackerEmotions_Utilisateurs_UtilisateurId",
                table: "TrackerEmotions");

            migrationBuilder.AddForeignKey(
                name: "FK_TrackerEmotions_Emotions2_Emotion2Id",
                table: "TrackerEmotions",
                column: "Emotion2Id",
                principalTable: "Emotions2",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TrackerEmotions_Utilisateurs_UtilisateurId",
                table: "TrackerEmotions",
                column: "UtilisateurId",
                principalTable: "Utilisateurs",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TrackerEmotions_Emotions2_Emotion2Id",
                table: "TrackerEmotions");

            migrationBuilder.DropForeignKey(
                name: "FK_TrackerEmotions_Utilisateurs_UtilisateurId",
                table: "TrackerEmotions");

            migrationBuilder.AddForeignKey(
                name: "FK_TrackerEmotions_Emotions2_Emotion2Id",
                table: "TrackerEmotions",
                column: "Emotion2Id",
                principalTable: "Emotions2",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TrackerEmotions_Utilisateurs_UtilisateurId",
                table: "TrackerEmotions",
                column: "UtilisateurId",
                principalTable: "Utilisateurs",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
