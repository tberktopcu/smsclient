using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace SmsSablon.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Infos",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Infos",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Infos",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "SmsHeaders",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "SmsHeaders",
                keyColumn: "Id",
                keyValue: 2);
        }
    }
}
