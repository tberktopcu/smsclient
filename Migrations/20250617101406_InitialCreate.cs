using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace SmsSablon.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SmsHeaders",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Header = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SmsHeaders", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Infos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    SmsText = table.Column<string>(type: "text", nullable: false),
                    IsLocked = table.Column<bool>(type: "boolean", nullable: false),
                    TemplateName = table.Column<string>(type: "text", nullable: false),
                    SmsHeaderId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Infos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Infos_SmsHeaders_SmsHeaderId",
                        column: x => x.SmsHeaderId,
                        principalTable: "SmsHeaders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "SmsHeaders",
                columns: new[] { "Id", "Header" },
                values: new object[,]
                {
                    { 1, "Duyuru" },
                    { 2, "Bilgilendirme" }
                });

            migrationBuilder.InsertData(
                table: "Infos",
                columns: new[] { "Id", "IsLocked", "SmsHeaderId", "SmsText", "TemplateName" },
                values: new object[,]
                {
                    { 1, false, 1, "Yarın tatil!", "Genel" },
                    { 2, true, 1, "Yeni etkinlik var", "Etkinlik" },
                    { 3, false, 2, "Sistem bakımı yapılacak.", "Teknik" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Infos_SmsHeaderId",
                table: "Infos",
                column: "SmsHeaderId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Infos");

            migrationBuilder.DropTable(
                name: "SmsHeaders");
        }
    }
}
