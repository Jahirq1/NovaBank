using System.ComponentModel.DataAnnotations;
namespace Nova_API.Models
{
    public class TransactionsHistory
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]// Combines type + other info
        public decimal Amount { get; set; }

        [Required]
        public DateTime TransactionDate { get; set; }
        [Required]
        public string Type { get; set; } // From TransactionType

        // Navigation to original transaction (if needed)
        public int TransactionId { get; set; }
        public Transaction SourceTransaction { get; set; }
    }
}
