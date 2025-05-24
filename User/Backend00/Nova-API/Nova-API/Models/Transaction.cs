using System.ComponentModel.DataAnnotations;

namespace Nova_API.Models
{
    public class Transaction
    {
        [Key]
        public int TransactionId { get; set; }
        [Required]
        public String? TransactionType { get; set; }
        [Required]
        public decimal Amount { get; set; }
        [Required]
        public DateTime TransactionDate { get; set; }

        public ICollection<KlientTransaction>? KlientTransactions { get; set; }

    }
}
