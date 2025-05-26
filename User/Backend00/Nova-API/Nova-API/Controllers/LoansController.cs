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
    public class LoansController : ControllerBase
    {
        private readonly NovaBankDbContext _context;

        public LoansController(NovaBankDbContext context)
        {
            _context = context;
        }

        // GET: api/Loans
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Loans>>> GetLoans()
        {
            return await _context.Loans.ToListAsync();
        }

        // GET: api/Loans/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Loans>> GetLoans(int id)
        {
            var loans = await _context.Loans.FindAsync(id);

            if (loans == null)
            {
                return NotFound();
            }

            return loans;
        }

        // PUT: api/Loans/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutLoans(int id, Loans loans)
        {
            if (id != loans.LoanId)
            {
                return BadRequest();
            }

            _context.Entry(loans).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LoansExists(id))
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

        // POST: api/Loans
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Loans>> PostLoans(Loans loans)
        {
            _context.Loans.Add(loans);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetLoans", new { id = loans.LoanId }, loans);
        }

        // DELETE: api/Loans/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLoans(int id)
        {
            var loans = await _context.Loans.FindAsync(id);
            if (loans == null)
            {
                return NotFound();
            }

            _context.Loans.Remove(loans);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool LoansExists(int id)
        {
            return _context.Loans.Any(e => e.LoanId == id);
        }
    }
}
