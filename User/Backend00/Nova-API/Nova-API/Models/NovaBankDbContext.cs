using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using NOVA_API.Models;
namespace NOVA_API.Models
{
    public class NovaBankDbContext : DbContext
    {
        public NovaBankDbContext(DbContextOptions<NovaBankDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<Loans> Loans { get; set; }
        public DbSet<KlientLoan> KlientLoans { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
                .HasIndex(u => u.PersonalID)
                .IsUnique();

            modelBuilder.Entity<Loans>()
                .Property(l => l.LoanAmount)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<Loans>()
                .Property(l => l.MonthlyIncome)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<User>()
                .Property(u => u.Balance)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<Transaction>()
                .Property(t => t.Amount)
                .HasColumnType("decimal(18,2)");

            // 🔁 Lidhja për Sender
            modelBuilder.Entity<Transaction>()
                .HasOne(t => t.Sender)
                .WithMany(u => u.SentTransactions)
                .HasForeignKey(t => t.SenderId)
                .OnDelete(DeleteBehavior.Restrict); // Për të shmangur fshirjen kaskadë

            // 🔁 Lidhja për Receiver
            modelBuilder.Entity<Transaction>()
                .HasOne(t => t.Receiver)
                .WithMany(u => u.ReceivedTransactions)
                .HasForeignKey(t => t.ReceiverId)
                .OnDelete(DeleteBehavior.Restrict);

            // 🔁 Lidhja many-to-many ndërmjet Klient dhe Loan
            modelBuilder.Entity<KlientLoan>()
                .HasKey(kl => new { kl.KlientId, kl.LoanId });

            modelBuilder.Entity<KlientLoan>()
                .HasOne(kl => kl.Klient)
                .WithMany(k => k.KlientLoans)
                .HasForeignKey(kl => kl.KlientId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<KlientLoan>()
                .HasOne(kl => kl.Loan)
                .WithMany(l => l.KlientLoans)
                .HasForeignKey(kl => kl.LoanId)
                .OnDelete(DeleteBehavior.Restrict);

        }
    }
}
