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
    public class KlientLoansController : ControllerBase
    {
        private readonly NovaBankDbContext _context;

        public KlientLoansController(NovaBankDbContext context)
        {
            _context = context;
        }

        // GET: api/KlientLoans
        [HttpGet]
        public async Task<ActionResult<IEnumerable<KlientLoan>>> GetKlientLoans()
        {
            return await _context.KlientLoans.ToListAsync();
        }

        // GET: api/KlientLoans/5
        [HttpGet("{id}")]
        public async Task<ActionResult<KlientLoan>> GetKlientLoan(int id)
        {
            var klientLoan = await _context.KlientLoans.FindAsync(id);

            if (klientLoan == null)
            {
                return NotFound();
            }

            return klientLoan;
        }

        // PUT: api/KlientLoans/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutKlientLoan(int id, KlientLoan klientLoan)
        {
            if (id != klientLoan.KlientId)
            {
                return BadRequest();
            }

            _context.Entry(klientLoan).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!KlientLoanExists(id))
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

        // POST: api/KlientLoans
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<KlientLoan>> PostKlientLoan(KlientLoan klientLoan)
        {
            _context.KlientLoans.Add(klientLoan);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (KlientLoanExists(klientLoan.KlientId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetKlientLoan", new { id = klientLoan.KlientId }, klientLoan);
        }

        // DELETE: api/KlientLoans/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteKlientLoan(int id)
        {
            var klientLoan = await _context.KlientLoans.FindAsync(id);
            if (klientLoan == null)
            {
                return NotFound();
            }

            _context.KlientLoans.Remove(klientLoan);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool KlientLoanExists(int id)
        {
            return _context.KlientLoans.Any(e => e.KlientId == id);
        }
    }
}
