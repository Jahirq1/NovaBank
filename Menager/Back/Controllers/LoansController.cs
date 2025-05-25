using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Backend.Data;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
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

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Loans>>> GetLoans()
        {
            return await _context.Loans.ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Loans>> ApplyLoan(Loans loan)
        {
            _context.Loans.Add(loan);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetLoans), new { id = loan.LoanId }, loan);
        }

        // GET: api/loans/pending
        [HttpGet("pending")]
        public async Task<ActionResult<IEnumerable<Loans>>> GetPendingLoans()
        {
            return await _context.Loans
                .Where(l => l.ApproveStatus == false)
                .ToListAsync();
        }

        // PUT: api/loans/{id}/approve
        [HttpPut("{id}/approve")]
        public async Task<IActionResult> ApproveLoan(int id)
        {
            var loan = await _context.Loans.FindAsync(id);
            if (loan == null)
                return NotFound();

            loan.ApproveStatus = true;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // PUT: api/loans/{id}/reject
        [HttpPut("{id}/reject")]
        public async Task<IActionResult> RejectLoan(int id)
        {
            var loan = await _context.Loans.FindAsync(id);
            if (loan == null)
                return NotFound();

            _context.Loans.Remove(loan);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
