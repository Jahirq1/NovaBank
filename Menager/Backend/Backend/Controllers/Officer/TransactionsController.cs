using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Models;
using Backend.Models.DTO;
using Microsoft.AspNetCore.Authorization;

namespace Backend.Controllers.Officer
{
    [Route("api/officer/transactions")]
    [ApiController]
    public class TransactionsController : ControllerBase
    {
        private readonly NovaBankDbContext _context;

        public TransactionsController(NovaBankDbContext context)
        {
            _context = context;
        }

        [HttpPost("pay")]
        public async Task<ActionResult<Transaction>> PostTransaction(Transactiontabel dto)
        {
            // Gjej Sender-in me id
            var sender = await _context.Users.FindAsync(dto.SenderId);

            // Gjej Receiver-in përmes PersonalID
            var receiver = await _context.Users
                .FirstOrDefaultAsync(u => u.PersonalID == dto.ReceiverPersonalID);

            if (sender == null || receiver == null)
            {
                return BadRequest("Sender or Receiver not found.");
            }

            if (sender.id == receiver.id)
            {
                return BadRequest("Nuk mund t’i dërgoni transaksion vetes.");
            }

            // Krijo transaksionin
            var transaction = new Transaction
            {
                TransactionType = dto.TransactionType,
                Amount = dto.Amount,
                TransactionDate = dto.TransactionDate,
                SenderId = sender.id,
                ReceiverId = receiver.id
            };

            // Shto shumën tek balanca e pranuesit
            receiver.Balance += dto.Amount;

            // Ruaj transaksionin dhe përditësimin e pranuesit
            _context.Transactions.Add(transaction);
            _context.Users.Update(receiver);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTransaction), new { id = transaction.TransactionId }, transaction);
        }



        // Optional: GET për të marrë një transaksion të veçantë
        [HttpGet("{id}")]
        public async Task<ActionResult<Transaction>> GetTransaction(int id)
        {
            var transaction = await _context.Transactions
                .Include(t => t.Sender)
                .Include(t => t.Receiver)
                .FirstOrDefaultAsync(t => t.TransactionId == id);

            if (transaction == null)
            {
                return NotFound();
            }

            return transaction;
        }


        [HttpGet("my-transactions")]
        [Authorize]
        public IActionResult GetMyTransactions()
        {
            // Lexo userId nga claims i tokenit
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserID");
            if (userIdClaim == null)
                return Unauthorized(new { message = "User ID not found in token" });

            if (!int.TryParse(userIdClaim.Value, out int userId))
                return Unauthorized(new { message = "Invalid User ID in token" });

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
        public IActionResult GetTotalSentAmount([FromQuery] int userId)
        {
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
        public IActionResult GetTransactionCount([FromQuery] int userId)
        {
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
