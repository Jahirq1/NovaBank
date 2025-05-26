using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace NOVA_API.Models
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
        public int DurationMonths { get; set; }
        public string Collateral { get; set; }
        public Boolean ApproveStatus { get; set; } = false;
        public string? RejectionReason { get; set; }

        public Boolean viewStatus { get; set; } = false;
        [ForeignKey("Manager")]
        public int ManagerId { get; set; }
        public User Manager { get; set; }

        public ICollection<KlientLoan> KlientLoans { get; set; }
    }
}
