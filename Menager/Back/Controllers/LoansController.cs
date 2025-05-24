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
    }
}
