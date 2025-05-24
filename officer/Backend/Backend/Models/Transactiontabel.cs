namespace Backend.Models
{
    public class Transactiontabel
    {
        public string TransactionType { get; set; }
        public decimal Amount { get; set; }
        public DateTime TransactionDate { get; set; }

        public int SenderId { get; set; }

        // Në vend të ReceiverId, kërkojmë PersonalID
        public int ReceiverPersonalID { get; set; }
    }
}

}
