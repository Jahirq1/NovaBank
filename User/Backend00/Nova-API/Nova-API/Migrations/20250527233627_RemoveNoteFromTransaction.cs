using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NOVA_API.Migrations
{
    public partial class RemoveNoteFromTransaction : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
        IF EXISTS (
            SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_NAME = 'Transactions' AND COLUMN_NAME = 'Note'
        )
        BEGIN
            ALTER TABLE [Transactions] DROP COLUMN [Note];
        END
    ");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Note",
                table: "Transactions",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}