
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class Loans
    {
        [Key]
        public int LoanId { get; set; }

        public int PersonalID { get; set; }
        public DateTime ApplicationDate { get; set; }
        public string WorkingStatus { get; set; }
        public decimal MonthlyIncome { get; set; }
        public decimal LoanAmount { get; set; }
        public string Reason { get; set; }
        public string? RejectionReason { get; set; }

        public int DurationMonths { get; set; }
        public string Collateral { get; set; }

        public LoanStatus Status { get; set; } = LoanStatus.Pending;  // Këtu përdoret enum

        public bool viewStatus { get; set; } = false;

        [ForeignKey("Manager")]
        public int ManagerId { get; set; }
        public User Manager { get; set; }

        public ICollection<KlientLoan> KlientLoans { get; set; }
    }
    public enum LoanStatus
    {
        Pending = 0,   // Në pritje
        Approved = 1,  // E aprovuar
        Rejected = 2   // E refuzuar / anuluar
    }
}
