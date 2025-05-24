using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Models;
using Backend.Services;

namespace Backend.Controllers
{
    [Route("api/transactions")]
    [ApiController]
    public class TransactionsController : ControllerBase
    {
        private readonly NovaBankDbContext _context;
        private readonly SessionService _sessionService;

        public TransactionsController(NovaBankDbContext context, SessionService sessionService)
        {
            _context = context;
            _sessionService = sessionService;
        }

        [HttpPost]
        public async Task<ActionResult<Transaction>> PostTransaction(Transactiontabel dto)
        {
            // Gjej Sender-in me id direkt
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

            var transaction = new Transaction
            {
                TransactionType = dto.TransactionType,
                Amount = dto.Amount,
                TransactionDate = dto.TransactionDate,
                SenderId = sender.id,
                ReceiverId = receiver.id
            };

            _context.Transactions.Add(transaction);
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
}

        [HttpGet("my-transactions")]
        public IActionResult GetMyTransactions([FromQuery] int userId)
        {
            var exists = _context.Users.Any(u => u.id == userId);
            if (!exists)
                return Unauthorized(new { message = "User not found" });

            var transactions = _context.Transactions
                .Where(t => t.SenderId == userId || t.ReceiverId == userId)
                .Select(t => new
                {
                    TransactionId = t.TransactionId,
                    Type = t.TransactionType,
                    Amount = t.Amount,
                    Date = t.TransactionDate,
                })
                .OrderByDescending(t => t.Date)
                .ToList();

            return Ok(transactions);
        }









        private bool TransactionExists(int id)
        {
            return _context.Transactions.Any(e => e.TransactionId == id);
        }
    }
}
