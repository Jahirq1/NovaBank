using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Nova_API.Models;
using System.Linq;

namespace Nova_API.Controllers
{
    [Route("api/Transactions")]
    [ApiController]
    public class TransactionsHistoriesController : ControllerBase
    {
        private readonly NovaBankDbContext _context;

        public TransactionsHistoriesController(NovaBankDbContext context)
        {
            _context = context;
        }
        // GET: api/TransactionsHistories/recent
        [HttpGet("recent")]
        public async Task<ActionResult<IEnumerable<TransactionHistoryItem>>> GetRecentTransactionHistory()
        {
            var recentTransactions = await _context.TransactionsHistories
                .OrderByDescending(t => t.TransactionDate)
                .Take(5)
                .Select(t => new TransactionHistoryItem
                {
                    Id = t.Id,
                    Description = t.Description,
                    Date = t.TransactionDate.ToString("dd MMM yyyy, hh:mm tt"),
                    Amount = t.Amount
                })
                .ToListAsync();

            return recentTransactions;
        }


        // GET: api/TransactionsHistories/dashboard
        [HttpGet("dashboard")]
        public async Task<ActionResult<DashboardSummary>> GetDashboardSummary()
        {
            var transactions = await _context.Transactions.ToListAsync();

            return new DashboardSummary
            {
                TotalBalance = transactions.Sum(t => t.Amount),
                TotalIncome = transactions.Where(t => t.Amount > 0).Sum(t => t.Amount),
                TotalExpense = Math.Abs(transactions.Where(t => t.Amount < 0).Sum(t => t.Amount)),
                RecentTransactions = transactions
                    .OrderByDescending(t => t.TransactionDate)
                    .Take(5)
                    .Select(t => new TransactionHistoryItem
                    {
                        Id = t.TransactionId,
                        Description = $"{t.TransactionType}: {t.Amount}",
                        Date = t.TransactionDate.ToString("dd MMM yyyy, hh:mm tt"),
                        Amount = t.Amount
                    })
                    .ToList()
            };
        }

        // GET: api/TransactionsHistories
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TransactionHistoryItem>>> GetTransactionHistory()
        {
            return await _context.Transactions
                .OrderByDescending(t => t.TransactionDate)
                .Select(t => new TransactionHistoryItem
                {
                    Id = t.TransactionId,
                    Description = $"{t.TransactionType}",
                    Date = t.TransactionDate.ToString("dd MMM yyyy"),
                    Amount = t.Amount
                })
                .ToListAsync();
        }

        // GET: api/TransactionsHistories/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TransactionDetail>> GetTransactionDetail(int id)
        {
            var transaction = await _context.Transactions
                .Where(t => t.TransactionId == id)
                .Select(t => new TransactionDetail
                {
                    Id = t.TransactionId,
                    Type = t.TransactionType,
                    Amount = t.Amount,
                    Date = t.TransactionDate,
                    // Include other details as needed
                })
                .FirstOrDefaultAsync();

            if (transaction == null)
            {
                return NotFound();
            }

            return transaction;
        }

        // Remove PUT, POST, DELETE unless you specifically need them
        // for history modifications (unlikely)
    }

    // DTO classes
    public class DashboardSummary
    {
        public decimal TotalBalance { get; set; }
        public decimal TotalIncome { get; set; }
        public decimal TotalExpense { get; set; }
        public List<TransactionHistoryItem> RecentTransactions { get; set; }
    }

    public class TransactionHistoryItem
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public string Date { get; set; }
        public decimal Amount { get; set; }
    }

    public class TransactionDetail
    {
        public int Id { get; set; }
        public string Type { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
    }
}