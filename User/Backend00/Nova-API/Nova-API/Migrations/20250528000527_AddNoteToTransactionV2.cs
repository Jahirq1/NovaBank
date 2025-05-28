using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NOVA_API.Migrations
{
    /// <inheritdoc />
    public partial class AddNoteToTransactionV2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
       name: "Note",
       table: "Transactions",
       type: "nvarchar(max)",
       nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
       name: "Note",
       table: "Transactions");
        }
    }
}
