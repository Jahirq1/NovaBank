using System.Transactions;

namespace Nova_API.Models
{
    public class KlientTransaction
    {
        // Ky është një çelës i huaj që lidhet me User (Klient)
        public int KlientId { get; set; }

        // Kjo është lidhja me modelin e User (Klienti) që po lidhim këtë transaksion
        public User Klient { get; set; }

        // Ky është një çelës i huaj që lidhet me Transaction
        public int TransactionId { get; set; }

        // Kjo është lidhja me modelin Transaction
        public Transaction Transaction { get; set; }

    }
}
