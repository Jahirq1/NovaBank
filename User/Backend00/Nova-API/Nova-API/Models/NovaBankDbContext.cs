using Microsoft.EntityFrameworkCore;
using Nova_API.Models;

namespace Nova_API.Models
{
    public class NovaBankDbContext : DbContext  // Critical: Added inheritance
    {
        // Initialize DbSets with null! to handle nullable warnings
        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Transaction> Transactions { get; set; } = null!;
        public DbSet<KlientTransaction> KlientTransactions { get; set; } = null!;
        public DbSet<KlientLoan> KlientLoans { get; set; } = null!;
        public DbSet<TransactionsHistory> TransactionsHistories { get; set; } = null;
        public DbSet<Loans> Loans { get; set; } = null!;  // Changed from Loans to Loan for consistency

        public NovaBankDbContext(DbContextOptions<NovaBankDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
                .HasIndex(u => u.PersonalID)
                .IsUnique();

            // Configure decimal precision
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

            modelBuilder.Entity<TransactionsHistory>()
                .Property(th => th.Amount)
                .HasColumnType("decimal(18,2)"); // Consistent decimal format

            modelBuilder.Entity<TransactionsHistory>()
                .HasIndex(th => th.TransactionDate);
            // Many-to-many: Klient-Transaction
            modelBuilder.Entity<KlientTransaction>()
                .HasKey(kt => new { kt.KlientId, kt.TransactionId });

            modelBuilder.Entity<KlientTransaction>()
                .HasOne(kt => kt.Klient)
                .WithMany(k => k.KlientTransactions)
                .HasForeignKey(kt => kt.KlientId);

            modelBuilder.Entity<KlientTransaction>()
                .HasOne(kt => kt.Transaction)
                .WithMany(t => t.KlientTransactions)
                .HasForeignKey(kt => kt.TransactionId);

            // Many-to-many: Klient-Loan
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
        public DbSet<Nova_API.Models.TransactionsHistory> TransactionsHistory { get; set; } = default!;
    }
}