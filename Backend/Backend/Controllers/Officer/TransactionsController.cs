using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Models;
using Backend.Models.DTO;

namespace Backend.Controllers.Officer
{
    [Route("api/officer/transactions")]
    [ApiController]
    [Authorize] // Shtojmë authorize për të gjitha endpoint-et
    public class TransactionsController : ControllerBase
    {
        private readonly NovaBankDbContext _context;

        public TransactionsController(NovaBankDbContext context)
        {
            _context = context;
        }

        [HttpPost("pay")]
        [Authorize(Roles = "officer")]
        public async Task<ActionResult<Transaction>> PostTransaction(Transactiontabel dto)
        {
            var senderIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserID");
            if (senderIdClaim == null || !int.TryParse(senderIdClaim.Value, out int senderIdFromToken))
                return Unauthorized(new { message = "Invalid user token" });

            // Heqim këtë kontroll sepse nuk e presim senderId nga klienti:
            // if (senderIdFromToken != dto.SenderId)
            //     return Unauthorized(new { message = "You can only send transactions from your own account" });

            var sender = await _context.Users.FindAsync(senderIdFromToken);
            var receiver = await _context.Users.FirstOrDefaultAsync(u => u.PersonalID == dto.ReceiverPersonalID);

            if (sender == null || receiver == null)
                return BadRequest("Sender or Receiver not found.");

            if (sender.id == receiver.id)
                return BadRequest("Nuk mund t’i dërgoni transaksion vetes.");

            var transaction = new Transaction
            {
                TransactionType = dto.TransactionType,
                Amount = dto.Amount,
                TransactionDate = dto.TransactionDate,
                SenderId = sender.id,
                ReceiverId = receiver.id
            };

            receiver.Balance += dto.Amount;

            _context.Transactions.Add(transaction);
            _context.Users.Update(receiver);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTransaction), new { id = transaction.TransactionId }, transaction);
        }


        [HttpGet("{id}")]
        [Authorize(Roles = "officer")]
        public async Task<ActionResult<Transaction>> GetTransaction(int id)
        {
            var transaction = await _context.Transactions
                .Include(t => t.Sender)
                .Include(t => t.Receiver)
                .FirstOrDefaultAsync(t => t.TransactionId == id);

            if (transaction == null)
                return NotFound();

            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserID");
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                return Unauthorized();

            // Kontrollo nëse useri ka të drejtë të shohë transaksionin (ose sender ose receiver)
            if (transaction.SenderId != userId && transaction.ReceiverId != userId)
                return Forbid();

            return transaction;
        }

        [HttpGet("my-transactions")]
        [Authorize(Roles = "officer")]
        public IActionResult GetMyTransactions()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserID");
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                return Unauthorized(new { message = "User ID not found or invalid in token" });

            var exists = _context.Users.Any(u => u.id == userId);
            if (!exists)
                return Unauthorized(new { message = "User not found" });

            var transactions = _context.Transactions
                .Where(t => t.SenderId == userId || t.ReceiverId == userId)
                .Select(t => new
                {
                    t.TransactionId,
                    Type = t.TransactionType,
                    t.Amount,
                    Date = t.TransactionDate,
                    SenderName = _context.Users.Where(u => u.id == t.SenderId).Select(u => u.name).FirstOrDefault(),
                    ReceiverName = _context.Users.Where(u => u.id == t.ReceiverId).Select(u => u.name).FirstOrDefault()
                })
                .OrderByDescending(t => t.Date)
                .ToList();

            return Ok(transactions);
        }

        [HttpGet("total-sent-amount")]
        [Authorize(Roles = "officer")]
        public IActionResult GetTotalSentAmount()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserID");
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                return Unauthorized();

            var exists = _context.Users.Any(u => u.id == userId);
            if (!exists)
                return NotFound(new { message = "User not found" });

            var oneYearAgo = DateTime.UtcNow.AddYears(-1);

            var totalAmount = _context.Transactions
                .Where(t => t.SenderId == userId && t.TransactionDate >= oneYearAgo)
                .Sum(t => (decimal?)t.Amount) ?? 0;

            return Ok(new { userId, totalAmount });
        }

        [HttpGet("transaction-count")]
        [Authorize(Roles = "officer")]
        public IActionResult GetTransactionCount()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserID");
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                return Unauthorized();

            var exists = _context.Users.Any(u => u.id == userId);
            if (!exists)
                return NotFound(new { message = "User not found" });

            var count = _context.Transactions.Count(t => t.SenderId == userId);

            return Ok(new { userId, totalSentTransactions = count });
        }

        private bool TransactionExists(int id)
        {
            return _context.Transactions.Any(e => e.TransactionId == id);
        }
    }
}
