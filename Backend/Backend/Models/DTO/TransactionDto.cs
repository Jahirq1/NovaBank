namespace Backend.Models.DTO
{
    public class TransactionDto
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public decimal Amount { get; set; }
        public string Note { get; set; }
        public string SenderName { get; set; }
        public int SenderPersonalId { get; set; }

        public int ReceiverPersonalId { get; set; }
        public string ReceiverName { get; set; }
    }
}
