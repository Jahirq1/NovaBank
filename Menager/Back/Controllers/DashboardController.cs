using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/dashboard")]
    public class DashboardController : ControllerBase
    {
        private readonly NovaBankDbContext _context;

        public DashboardController(NovaBankDbContext context)
        {
            _context = context;
        }

        // GET: api/dashboard/summary
        [HttpGet("summary")]
        public async Task<IActionResult> GetSummary()
        {
            var totalBalance = await _context.Users.SumAsync(u => u.Balance);
            var totalUsers = await _context.Users.CountAsync();
            var totalOfficers = await _context.Users.CountAsync(u => u.role == "officer");

            return Ok(new
            {
                totalBalance,
                totalUsers,
                totalOfficers
            });
        }

        // GET: api/dashboard/transactions
        [HttpGet("transactions")]
        public async Task<IActionResult> GetDailyTransactions()
        {
            var result = await _context.Transactions
                .GroupBy(t => t.TransactionDate)
                .Select(g => new
                {
                    TransactionDate = g.Key,
                    deposit = g.Where(t => t.TransactionType == "deposit").Sum(t => t.Amount),
                    withdrawal = g.Where(t => t.TransactionType == "withdrawal").Sum(t => t.Amount)
                })
                .ToListAsync();

            return Ok(result);
        }

        // GET: api/dashboard/loans
        [HttpGet("loans")]
        public async Task<IActionResult> GetLoanData()
        {
            var result = await _context.KlientLoans
                .Include(kl => kl.Klient)
                .Include(kl => kl.Loan)
                .GroupBy(kl => kl.Klient.name)
                .Select(g => new
                {
                    customer = g.Key,
                    loanGiven = g.Sum(kl => kl.Loan.LoanAmount)
                })
                .ToListAsync();

            return Ok(result);
        }
    }
}
