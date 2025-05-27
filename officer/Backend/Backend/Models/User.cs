using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class User
    {
        [Key]
        public int id { get; set; }

        [Required]
        public int PersonalID { get; set; }  

        [Required]
        public string? name { get; set; }

        [Required]
        public string? email { get; set; }

        
        public string? password { get; set; }

        [Required]
        public DateOnly? dateOfBirth { get; set; }

        public decimal Balance { get; set; }

        [Required]
        public string? role { get; set; }

        [Required]
        public string? phone { get; set; }

        [Required]
        public string? address { get; set; }

        
         public DateTime? createdDate { get; set; } = default(DateTime?);
        [Required]
        public string? city { get; set; }

        public ICollection<Transaction> SentTransactions { get; set; } = new List<Transaction>();
        public ICollection<Transaction> ReceivedTransactions { get; set; } = new List<Transaction>();
        public ICollection<KlientLoan> KlientLoans { get; set; } = new List<KlientLoan>();

    }
}
