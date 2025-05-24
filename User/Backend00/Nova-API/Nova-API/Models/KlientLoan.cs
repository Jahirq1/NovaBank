

namespace Nova_API.Models
{
    public class KlientLoan
    {
        public int KlientId { get; set; }
        public User Klient { get; set; }

        public int LoanId { get; set; }
        public Loans Loan { get; set; }

    }
}
