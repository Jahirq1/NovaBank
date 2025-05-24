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
    [Route("api/loans")]
    [ApiController]
    public class LoansController : ControllerBase
    {
        private readonly NovaBankDbContext _context;
        private readonly SessionService _sessionService;
        public LoansController(NovaBankDbContext context, SessionService sessionService)
        {
            _sessionService = sessionService;
            _context = context;
        }

        [HttpGet("my-loans")]
        public IActionResult GetMyLoans()
        {
            var userIdString = HttpContext.Session.GetString("UserId");

            if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int userId))
            {
                return Unauthorized(new { message = "User not logged in" });
            }

            var loans = _context.KlientLoans
                .Where(kl => kl.KlientId == userId)
                .Include(kl => kl.Loan)  // Përfshi të dhënat e kreditit
                .ThenInclude(l => l.Manager)  // Përfshi të dhënat e menaxherit
                .Select(kl => new
                {
                    LoanId = kl.Loan.LoanId,
                    LoanAmount = kl.Loan.LoanAmount,
                    ApplicationDate = kl.Loan.ApplicationDate,
                    MonthlyIncome = kl.Loan.MonthlyIncome,
                    DurationMonths = kl.Loan.DurationMonths,
                    Collateral = kl.Loan.Collateral,
                    ApproveStatus = kl.Loan.ApproveStatus,
                    Reason = kl.Loan.Reason,
                    ManagerName = kl.Loan.Manager.name  // Emri i menaxherit të kredive
                })
                .ToList();

            return Ok(loans);
        }
        [HttpGet("my-loans-count")]
        public IActionResult GetMyLoansCount([FromQuery] int userId)
        {
            // Verifikim bazik nëse ekziston user-i
            var exists = _context.Users.Any(u => u.id == userId);
            if (!exists)
                return Unauthorized(new { message = "User not found" });

            var loansCount = _context.KlientLoans
                .Where(kl => kl.KlientId == userId)
                .Count();

            return Ok(new { totalLoans = loansCount });
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
