using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class User
    {
        [Key] public int id { get; set; }
        [Required] public int PersonalID { get; set; }
        [Required] public string? name { get; set; }
        [Required] public string? email { get; set; }
        public string? password { get; set; }
        [Required] public DateOnly? dateOfBirth { get; set; }


        public decimal Balance { get; set; }

        [Precision(18, 2)]
        public decimal? SpendingLimit { get; set; } = 5000m;

        /* ➜ data-ora kur transferet janë të bllokuara.
           Nëse është null ose <= UTC now, transferet lejohen. */
        public DateTime? TransferBlockedUntil { get; set; }

        [Required] public string? role { get; set; }
        [Required] public string? phone { get; set; }
        [Required] public string? address { get; set; }
        [Required] public string? city { get; set; }

        public DateTime? createdDate { get; set; } = DateTime.UtcNow;

        public ICollection<Transaction> SentTransactions { get; set; }
        public ICollection<Transaction> ReceivedTransactions { get; set; }
        public ICollection<KlientLoan> KlientLoans { get; set; }
    }
}
