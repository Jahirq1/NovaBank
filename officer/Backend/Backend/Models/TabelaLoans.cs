namespace Backend.Models
{
    public class TabelaLoans
    {
        public int PersonalID { get; set; }
        public DateTime ApplicationDate { get; set; }
        public string WorkingStatus { get; set; }
        public decimal MonthlyIncome { get; set; }
        public decimal LoanAmount { get; set; }
        public string Reason { get; set; }
        public int DurationMonths { get; set; }
        public string Collateral { get; set; }
        public int ManagerId { get; set; }
    }
}
