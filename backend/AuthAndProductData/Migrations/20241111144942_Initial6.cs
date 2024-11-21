using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AuthAndProductData.Migrations
{
    /// <inheritdoc />
    public partial class Initial6 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CardCVV",
                table: "PaymentDetails");

            migrationBuilder.DropColumn(
                name: "CardExpiry",
                table: "PaymentDetails");

            migrationBuilder.DropColumn(
                name: "CardNumber",
                table: "PaymentDetails");

            migrationBuilder.AddColumn<decimal>(
                name: "Amount",
                table: "PaymentDetails",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "TransactionId",
                table: "PaymentDetails",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_PaymentDetails_TransactionId",
                table: "PaymentDetails",
                column: "TransactionId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_PaymentDetails_TransactionId",
                table: "PaymentDetails");

            migrationBuilder.DropColumn(
                name: "Amount",
                table: "PaymentDetails");

            migrationBuilder.DropColumn(
                name: "TransactionId",
                table: "PaymentDetails");

            migrationBuilder.AddColumn<int>(
                name: "CardCVV",
                table: "PaymentDetails",
                type: "int",
                maxLength: 4,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CardExpiry",
                table: "PaymentDetails",
                type: "nvarchar(5)",
                maxLength: 5,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CardNumber",
                table: "PaymentDetails",
                type: "nvarchar(16)",
                maxLength: 16,
                nullable: false,
                defaultValue: "");
        }
    }
}
