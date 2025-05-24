using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Backend.Data
{
    public class NovaBankDbContext : DbContext
    {
        public NovaBankDbContext(DbContextOptions<NovaBankDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<KlientTransaction> KlientTransactions { get; set; }
        public DbSet<KlientLoan> KlientLoans { get; set; }
        public DbSet<Loans> Loans { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            var dateOnlyConverter = new ValueConverter<DateOnly, DateTime>(
                d => d.ToDateTime(TimeOnly.MinValue),
                d => DateOnly.FromDateTime(d)
            );

            var nullableDateOnlyConverter = new ValueConverter<DateOnly?, DateTime?>(
                d => d.HasValue ? d.Value.ToDateTime(TimeOnly.MinValue) : null,
                d => d.HasValue ? DateOnly.FromDateTime(d.Value) : null
            );

            modelBuilder.Entity<User>()
                .Property(u => u.dateOfBirth)
                .HasConversion(nullableDateOnlyConverter);

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
