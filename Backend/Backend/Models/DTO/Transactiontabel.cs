namespace Backend.Models.DTO
{
    public class Transactiontabel
    {
        public string TransactionType { get; set; }
        public decimal Amount { get; set; }
        public DateTime TransactionDate { get; set; }

        public int SenderId { get; set; }

        public int ReceiverPersonalID { get; set; }
    }
}

