namespace Backend.Models.DTO
{
    public class TransferRequest
    {
        public int SenderId { get; set; } 

        public int RecipientPersonalID { get; set; }
        public decimal Amount { get; set; }
        public string? Note { get; set; }
    }
}
