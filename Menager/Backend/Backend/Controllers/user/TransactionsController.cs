using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Models;
using Backend.Models.DTO;

namespace NOVA_API.Controllers
{
    [Route("api/user/transactions")]
    [ApiController]
    public class TransactionsController : ControllerBase
    {
        private readonly NovaBankDbContext _context;

        public TransactionsController(NovaBankDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Transaction>>> GetTransactions()
        {
            return await _context.Transactions.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Transaction>> GetTransaction(int id)
        {
            var transaction = await _context.Transactions.FindAsync(id);
            if (transaction == null)
                return NotFound();

            return transaction;
        }

   





        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserTransactions(int userId)
        {
            var transactions = await _context.Transactions
                .Where(t => t.SenderId == userId || t.ReceiverId == userId)
                .Include(t => t.Sender)
                .Include(t => t.Receiver)
                .OrderByDescending(t => t.TransactionDate)
                .ToListAsync();

            var result = transactions.Select(t => new TransactionDto
            {
                Id = t.TransactionId,
                Date = t.TransactionDate,
                Amount = t.SenderId == userId ? -t.Amount : t.Amount,
                Note = t.Note,
                SenderName = t.Sender.name + " " + t.Sender.name,
                ReceiverName = t.Receiver.name + " " + t.Receiver.name,
                SenderPersonalId = t.Sender.PersonalID,
                ReceiverPersonalId = t.Receiver.PersonalID
            });
            return Ok(result);
        }

        [HttpPost("transfer")]
        public async Task<IActionResult> Transfer([FromBody] TransferRequest req)
        {
            if (req.Amount <= 0)
                return BadRequest("Shuma duhet të jetë më e madhe se 0 €.");

            if (req.Amount > 5000)
                return BadRequest("Shuma nuk mund të jetë më e madhe se 5000 €.");

            var sender = await _context.Users.FindAsync(req.SenderId);
            if (sender is null)
                return NotFound("Dërguesi nuk u gjet.");

            var receiver = await _context.Users
                .FirstOrDefaultAsync(u => u.PersonalID == req.RecipientPersonalID);
            if (receiver is null)
                return NotFound("Përfituesi nuk u gjet.");

            if (sender.role == "user")
            {
                var now = DateTime.UtcNow;

                // Bllokimi në fuqi?
                if (sender.TransferBlockedUntil is not null && sender.TransferBlockedUntil > now)
                {
                    return BadRequest(new
                    {
                        message = $"Transfers are blocked until {sender.TransferBlockedUntil:yyyy-MM-dd HH:mm} UTC"
                    });
                }

                // Nëse bllokimi ka përfunduar => reset shpenzimet
                DateTime limitStart = sender.TransferBlockedUntil is not null && sender.TransferBlockedUntil <= now
                    ? now
                    : new DateTime(now.Year, now.Month, 1);

                // Shuma e shpenzuar prej reset-it
                var spent = await _context.Transactions
                    .Where(t => t.SenderId == sender.id &&
                                t.TransactionType == "Transfer" &&
                                t.TransactionDate >= limitStart)
                    .SumAsync(t => t.Amount);

                if (sender.SpendingLimit is not null && spent + req.Amount > sender.SpendingLimit)
                {
                    sender.TransferBlockedUntil = now.AddHours(24); // ose .AddHours(24)
                    await _context.SaveChangesAsync();

                    return BadRequest(new
                    {
                        message = $"Spending limit exceeded ({spent + req.Amount} € > {sender.SpendingLimit} €). Transfers blocked temporarily."
                    });
                }
            }

            if (sender.Balance < req.Amount)
                return BadRequest("Saldoja e dërguesit nuk mjafton.");

            sender.Balance -= req.Amount;
            receiver.Balance += req.Amount;

            var tx = new Transaction
            {
                TransactionType = "Transfer",
                Amount = req.Amount,
                TransactionDate = DateTime.UtcNow,
                SenderId = sender.id,
                ReceiverId = receiver.id,
                Note = req.Note
            };

            _context.Transactions.Add(tx);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Transferi u krye me sukses.",
                newBalance = sender.Balance,
                transactionId = tx.TransactionId
            });
        }


        [HttpGet("monthly-expense/{userId}")]
        public async Task<ActionResult<decimal>> GetMonthlyExpense(int userId)
        {
            var now = DateTime.UtcNow;

            // Gjej përdoruesin
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return NotFound("Përdoruesi nuk u gjet.");

            // Përcakto datën e fillimit të llogaritjes
            DateTime fromDate = user.TransferBlockedUntil ?? new DateTime(now.Year, now.Month, 1);

            // Llogarit shpenzimet nga fromDate
            var totalExpense = await _context.Transactions
                .Where(t => t.SenderId == userId &&
                            t.TransactionType == "Transfer" &&
                            t.TransactionDate >= fromDate)
                .SumAsync(t => t.Amount);

            return Ok(totalExpense);
        }




        private bool TransactionExists(int id)
        {
            return _context.Transactions.Any(e => e.TransactionId == id);
        }
    }
}