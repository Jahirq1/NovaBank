using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Models;
using Backend.Models.DTO;

namespace NOVA_API.Controllers
{
    [Route("api/user/transactions")]
    [ApiController]
    [Authorize]
    public class TransactionsController : ControllerBase
    {
        private readonly NovaBankDbContext _context;

        public TransactionsController(NovaBankDbContext context)
        {
            _context = context;
        }

        #region Helpers
        private int GetCurrentUserId()
        {
            var idStr = User.FindFirst("UserID")?.Value ??
                        User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(idStr, out var id) ? id : 0;
        }
        #endregion

        [HttpGet("me")]
        public async Task<IActionResult> GetMyTransactions()
        {
            int userId = GetCurrentUserId();
            if (userId == 0) return Unauthorized();

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
                SenderName = t.Sender.name,
                ReceiverName = t.Receiver.name,
                SenderPersonalId = t.Sender.PersonalID,
                ReceiverPersonalId = t.Receiver.PersonalID
            });

            return Ok(result);
        }

        [HttpGet("me/{id:int}")]
        public async Task<IActionResult> GetMyTransaction(int id)
        {
            int userId = GetCurrentUserId();
            if (userId == 0) return Unauthorized();

            var tx = await _context.Transactions
                .Include(t => t.Sender)
                .Include(t => t.Receiver)
                .FirstOrDefaultAsync(t => t.TransactionId == id &&
                                           (t.SenderId == userId || t.ReceiverId == userId));
            if (tx is null) return NotFound();

            var dto = new TransactionDto
            {
                Id = tx.TransactionId,
                Date = tx.TransactionDate,
                Amount = tx.SenderId == userId ? -tx.Amount : tx.Amount,
                Note = tx.Note,
                SenderName = tx.Sender.name,
                ReceiverName = tx.Receiver.name,
                SenderPersonalId = tx.Sender.PersonalID,
                ReceiverPersonalId = tx.Receiver.PersonalID
            };

            return Ok(dto);
        }

        [HttpGet("me/monthly-expense")]
        public async Task<IActionResult> GetMyMonthlyExpense()
        {
            int userId = GetCurrentUserId();
            if (userId == 0) return Unauthorized();

            var now = DateTime.UtcNow;
            var user = await _context.Users.FindAsync(userId);
            if (user is null) return NotFound();

            DateTime fromDate = user.TransferBlockedUntil ?? new DateTime(now.Year, now.Month, 1);

            var totalExpense = await _context.Transactions
                .Where(t => t.SenderId == userId &&
                            t.TransactionType == "Transfer" &&
                            t.TransactionDate >= fromDate)
                .SumAsync(t => t.Amount);

            return Ok(totalExpense);
        }

        [HttpPost("transfer")]
        public async Task<IActionResult> Transfer([FromBody] TransferRequest req)
        {
            if (req.Amount <= 0)
                return BadRequest("Shuma duhet të jetë më e madhe se 0 €.");

            if (req.Amount > 5000)
                return BadRequest("Shuma nuk mund të jetë më e madhe se 5000 €.");

            int currentUserId = GetCurrentUserId();
            if (currentUserId == 0 || currentUserId != req.SenderId)
                return Unauthorized();

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

                if (sender.TransferBlockedUntil is not null && sender.TransferBlockedUntil > now)
                {
                    return BadRequest(new
                    {
                        message = $"Transfers are blocked until {sender.TransferBlockedUntil:yyyy-MM-dd HH:mm} UTC"
                    });
                }

                DateTime limitStart = sender.TransferBlockedUntil is not null && sender.TransferBlockedUntil <= now
                    ? now
                    : new DateTime(now.Year, now.Month, 1);

                var spent = await _context.Transactions
                    .Where(t => t.SenderId == sender.id &&
                                t.TransactionType == "Transfer" &&
                                t.TransactionDate >= limitStart)
                    .SumAsync(t => t.Amount);

                if (sender.SpendingLimit is not null && spent + req.Amount > sender.SpendingLimit)
                {
                    sender.TransferBlockedUntil = now.AddHours(24);
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
    }
}
