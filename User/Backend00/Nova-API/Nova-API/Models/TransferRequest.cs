namespace NOVA_API.Models
{
    public class TransferRequest
    {
            public int SenderId { get; set; } // Kjo vjen prej frontend-it

        public int RecipientPersonalID { get; set; }
        public decimal Amount { get; set; }
        public string? Note { get; set; }
    }
}
