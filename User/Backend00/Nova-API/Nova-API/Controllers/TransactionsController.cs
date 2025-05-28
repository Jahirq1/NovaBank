using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NOVA_API.Models;



namespace NOVA_API.Controllers
{
    [Route("api/[controller]")]
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


   
        // GET: api/Transactions
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Transaction>>> GetTransactions()
        {
            return await _context.Transactions.ToListAsync();
        }

        // GET: api/Transactions/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Transaction>> GetTransaction(int id)
        {
            var transaction = await _context.Transactions.FindAsync(id);
            if (transaction == null)
                return NotFound();

            return transaction;
        }

        // PUT: api/Transactions/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTransaction(int id, Transaction transaction)
        {
            if (id != transaction.TransactionId)
                return BadRequest();

            _context.Entry(transaction).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TransactionExists(id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // POST: api/Transactions
        [HttpPost]
        public async Task<ActionResult<Transaction>> PostTransaction(Transaction transaction)
        {
            _context.Transactions.Add(transaction);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTransaction", new { id = transaction.TransactionId }, transaction);
        }

        // DELETE: api/Transactions/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTransaction(int id)
        {
            var transaction = await _context.Transactions.FindAsync(id);
            if (transaction == null)
                return NotFound();

            _context.Transactions.Remove(transaction);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/Transactions/user/4
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
                SenderPersonalId = t.Sender.PersonalID, // ➕
                ReceiverPersonalId = t.Receiver.PersonalID // ➕
            });
            return Ok(result);
        }


        [HttpPost("transfer")]
        public async Task<IActionResult> Transfer([FromBody] TransferRequest request)
        {
            // Merr id e dërguesit nga sesioni


            if (request.Amount <= 0)
                return BadRequest(new { message = "Shuma duhet të jetë më e madhe se zero." });

            // Merr userin dërgues
            var sender = await _context.Users.FirstOrDefaultAsync(u => u.id == request.SenderId);
            if (sender == null)
                return NotFound(new { message = "Dërguesi nuk u gjet." });


            // Merr userin marrës sipas PersonalID
            var receiver = await _context.Users.FirstOrDefaultAsync(u => u.PersonalID == request.RecipientPersonalID);
            if (receiver == null)
                return NotFound(new { message = "Përfituesi nuk u gjet." });

            if (sender.Balance < request.Amount)
                return BadRequest(new { message = "Saldoja nuk mjafton për këtë transfer." });

            // Gjenero transaksionin dhe përditëso bilancet
            sender.Balance -= request.Amount;
            receiver.Balance += request.Amount;

            var transaction = new Transaction
            {
                TransactionType = "Transfer",
                Amount = request.Amount,
                TransactionDate = DateTime.UtcNow,
                SenderId = sender.id,
                ReceiverId = receiver.id,
                Note = request.Note
            };

            _context.Transactions.Add(transaction);


            // Ruaj ndryshimet në DB
            await _context.SaveChangesAsync();

            return Ok(new { message = "Transferimi u krye me sukses." });

        }

        private bool TransactionExists(int id)
        {
            return _context.Transactions.Any(e => e.TransactionId == id);
        }
    }
}
