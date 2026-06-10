using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace CesiZen.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialPostgresMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Emotions1",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Nom = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    NomCreateur = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    DateCreation = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Emotions1", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Informations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Titre = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Type = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Contenu = table.Column<string>(type: "text", nullable: false),
                    DateCreation = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DateModification = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Informations", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Utilisateurs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Pseudo = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Role = table.Column<int>(type: "integer", nullable: false),
                    EstActif = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    DateCreation = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    MotDePasseHash = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    Email = table.Column<string>(type: "character varying(254)", maxLength: 254, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Utilisateurs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Emotions2",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Emotion1Id = table.Column<int>(type: "integer", nullable: false),
                    Nom = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    NomCreateur = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    DateCreation = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Emotions2", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Emotions2_Emotions1_Emotion1Id",
                        column: x => x.Emotion1Id,
                        principalTable: "Emotions1",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TrackerEmotions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UtilisateurId = table.Column<int>(type: "integer", nullable: false),
                    Emotion2Id = table.Column<int>(type: "integer", nullable: false),
                    DateSaisie = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrackerEmotions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TrackerEmotions_Emotions2_Emotion2Id",
                        column: x => x.Emotion2Id,
                        principalTable: "Emotions2",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TrackerEmotions_Utilisateurs_UtilisateurId",
                        column: x => x.UtilisateurId,
                        principalTable: "Utilisateurs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Emotions1_Nom",
                table: "Emotions1",
                column: "Nom",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Emotions2_Emotion1Id",
                table: "Emotions2",
                column: "Emotion1Id");

            migrationBuilder.CreateIndex(
                name: "IX_Emotions2_Emotion1Id_Nom",
                table: "Emotions2",
                columns: new[] { "Emotion1Id", "Nom" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Informations_Type",
                table: "Informations",
                column: "Type");

            migrationBuilder.CreateIndex(
                name: "IX_TrackerEmotions_Emotion2Id",
                table: "TrackerEmotions",
                column: "Emotion2Id");

            migrationBuilder.CreateIndex(
                name: "IX_TrackerEmotions_UtilisateurId_DateSaisie",
                table: "TrackerEmotions",
                columns: new[] { "UtilisateurId", "DateSaisie" });

            migrationBuilder.CreateIndex(
                name: "IX_Utilisateurs_Email",
                table: "Utilisateurs",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Utilisateurs_EstActif",
                table: "Utilisateurs",
                column: "EstActif");

            migrationBuilder.CreateIndex(
                name: "IX_Utilisateurs_Pseudo",
                table: "Utilisateurs",
                column: "Pseudo",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Informations");

            migrationBuilder.DropTable(
                name: "TrackerEmotions");

            migrationBuilder.DropTable(
                name: "Emotions2");

            migrationBuilder.DropTable(
                name: "Utilisateurs");

            migrationBuilder.DropTable(
                name: "Emotions1");
        }
    }
}
