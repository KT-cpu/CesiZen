using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CesiZen.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Backend : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Consultations_Utilisateurs_UtilisateurId",
                table: "Consultations");

            migrationBuilder.DropForeignKey(
                name: "FK_Emotions2_Emotions1_Emotion1Id",
                table: "Emotions2");

            migrationBuilder.DropForeignKey(
                name: "FK_TrackerEmotions_Emotions2_Emotion2Id",
                table: "TrackerEmotions");

            migrationBuilder.DropForeignKey(
                name: "FK_TrackerEmotions_Utilisateurs_UtilisateurId",
                table: "TrackerEmotions");

            migrationBuilder.AlterColumn<string>(
                name: "MotDePasseHash",
                table: "Utilisateurs",
                type: "nvarchar(256)",
                maxLength: 256,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(60)",
                oldMaxLength: 60);

            migrationBuilder.AlterColumn<bool>(
                name: "EstActif",
                table: "Utilisateurs",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateCreation",
                table: "Utilisateurs",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "GETUTCDATE()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateSaisie",
                table: "TrackerEmotions",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "GETUTCDATE()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModification",
                table: "Informations",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "GETUTCDATE()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateCreation",
                table: "Informations",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "GETUTCDATE()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateCreation",
                table: "Emotions2",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "GETUTCDATE()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateCreation",
                table: "Emotions1",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "GETUTCDATE()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateConsultation",
                table: "Consultations",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "GETUTCDATE()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.CreateIndex(
                name: "IX_Utilisateurs_EstActif",
                table: "Utilisateurs",
                column: "EstActif");

            migrationBuilder.CreateIndex(
                name: "IX_Utilisateurs_Pseudo",
                table: "Utilisateurs",
                column: "Pseudo",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Informations_Type",
                table: "Informations",
                column: "Type");

            migrationBuilder.CreateIndex(
                name: "IX_Consultations_UtilisateurId_InformationId",
                table: "Consultations",
                columns: new[] { "UtilisateurId", "InformationId" });

            migrationBuilder.AddForeignKey(
                name: "FK_Consultations_Utilisateurs_UtilisateurId",
                table: "Consultations",
                column: "UtilisateurId",
                principalTable: "Utilisateurs",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Emotions2_Emotions1_Emotion1Id",
                table: "Emotions2",
                column: "Emotion1Id",
                principalTable: "Emotions1",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Consultations_Utilisateurs_UtilisateurId",
                table: "Consultations");

            migrationBuilder.DropForeignKey(
                name: "FK_Emotions2_Emotions1_Emotion1Id",
                table: "Emotions2");

            migrationBuilder.DropForeignKey(
                name: "FK_TrackerEmotions_Emotions2_Emotion2Id",
                table: "TrackerEmotions");

            migrationBuilder.DropForeignKey(
                name: "FK_TrackerEmotions_Utilisateurs_UtilisateurId",
                table: "TrackerEmotions");

            migrationBuilder.DropIndex(
                name: "IX_Utilisateurs_EstActif",
                table: "Utilisateurs");

            migrationBuilder.DropIndex(
                name: "IX_Utilisateurs_Pseudo",
                table: "Utilisateurs");

            migrationBuilder.DropIndex(
                name: "IX_Informations_Type",
                table: "Informations");

            migrationBuilder.DropIndex(
                name: "IX_Consultations_UtilisateurId_InformationId",
                table: "Consultations");

            migrationBuilder.AlterColumn<string>(
                name: "MotDePasseHash",
                table: "Utilisateurs",
                type: "nvarchar(60)",
                maxLength: 60,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(256)",
                oldMaxLength: 256);

            migrationBuilder.AlterColumn<bool>(
                name: "EstActif",
                table: "Utilisateurs",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateCreation",
                table: "Utilisateurs",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "GETUTCDATE()");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateSaisie",
                table: "TrackerEmotions",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "GETUTCDATE()");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateModification",
                table: "Informations",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "GETUTCDATE()");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateCreation",
                table: "Informations",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "GETUTCDATE()");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateCreation",
                table: "Emotions2",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "GETUTCDATE()");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateCreation",
                table: "Emotions1",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "GETUTCDATE()");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateConsultation",
                table: "Consultations",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "GETUTCDATE()");

            migrationBuilder.AddForeignKey(
                name: "FK_Consultations_Utilisateurs_UtilisateurId",
                table: "Consultations",
                column: "UtilisateurId",
                principalTable: "Utilisateurs",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Emotions2_Emotions1_Emotion1Id",
                table: "Emotions2",
                column: "Emotion1Id",
                principalTable: "Emotions1",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

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
    }
}
