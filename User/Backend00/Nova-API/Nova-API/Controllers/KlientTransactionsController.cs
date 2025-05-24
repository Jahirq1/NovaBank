using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Nova_API.Models;

namespace Nova_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class KlientTransactionsController : ControllerBase
    {
        private readonly NovaBankDbContext _context;

        public KlientTransactionsController(NovaBankDbContext context)
        {
            _context = context;
        }

        // GET: api/KlientTransactions
        [HttpGet]
        public async Task<ActionResult<IEnumerable<KlientTransaction>>> GetKlientTransactions()
        {
            return await _context.KlientTransactions.ToListAsync();
        }

        // GET: api/KlientTransactions/5
        [HttpGet("{id}")]
        public async Task<ActionResult<KlientTransaction>> GetKlientTransaction(int id)
        {
            var klientTransaction = await _context.KlientTransactions.FindAsync(id);

            if (klientTransaction == null)
            {
                return NotFound();
            }

            return klientTransaction;
        }

        // PUT: api/KlientTransactions/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutKlientTransaction(int id, KlientTransaction klientTransaction)
        {
            if (id != klientTransaction.KlientId)
            {
                return BadRequest();
            }

            _context.Entry(klientTransaction).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!KlientTransactionExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/KlientTransactions
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<KlientTransaction>> PostKlientTransaction(KlientTransaction klientTransaction)
        {
            _context.KlientTransactions.Add(klientTransaction);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (KlientTransactionExists(klientTransaction.KlientId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetKlientTransaction", new { id = klientTransaction.KlientId }, klientTransaction);
        }

        // DELETE: api/KlientTransactions/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteKlientTransaction(int id)
        {
            var klientTransaction = await _context.KlientTransactions.FindAsync(id);
            if (klientTransaction == null)
            {
                return NotFound();
            }

            _context.KlientTransactions.Remove(klientTransaction);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool KlientTransactionExists(int id)
        {
            return _context.KlientTransactions.Any(e => e.KlientId == id);
        }
    }
}
