using Backend.Models;

namespace Backend.Models
{
    public class KlientTransaction
    {
        public int KlientId { get; set; }
        public User Klient { get; set; }

        public int TransactionId { get; set; }
        public Transaction Transaction { get; set; }
    }
}
