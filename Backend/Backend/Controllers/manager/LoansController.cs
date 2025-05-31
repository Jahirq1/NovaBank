using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Models;
using Backend.Pdf;
using Microsoft.AspNetCore.Authorization;

namespace Backend.Controllers.manager
{
    // DTO to project only the fields your UI needs
    public class LoanDto
    {
        public int LoanId { get; set; }
        public int PersonalID { get; set; }
        public string Name { get; set; } = "";     // client’s name
        public string? Avatar { get; set; }        // optional user avatar URL
        public decimal LoanAmount { get; set; }
        public int DurationMonths { get; set; }
        public DateTime ApplicationDate { get; set; }
        public string Reason { get; set; } = "";
        public bool ApproveStatus { get; set; }
    }

    [Route("api/manager/loans")]
    [ApiController]
    [Authorize]
    public class LoansController : ControllerBase
    {
        private readonly NovaBankDbContext _context;
        private readonly PdfGenerator _pdfGenerator;

        public LoansController(NovaBankDbContext context, PdfGenerator pdfGenerator)
        {
            _context = context;
            _pdfGenerator = pdfGenerator;
        }

        // GET: api/manager/loans/pending
        [HttpGet("pending")]
        [Authorize(Roles = "manager")]
        public async Task<ActionResult<IEnumerable<LoanDto>>> GetPendingLoans()
        {
            return await _context.Loans
                .Where(l => !l.ApproveStatus)
                .Join(_context.Users,
                      loan => loan.PersonalID,
                      user => user.PersonalID,
                      (loan, user) => new LoanDto
                      {
                          LoanId = loan.LoanId,
                          PersonalID = loan.PersonalID,
                          Name = user.name,
                          Avatar = null,             // or user.avatarUrl if you have one
                          LoanAmount = loan.LoanAmount,
                          DurationMonths = loan.DurationMonths,
                          ApplicationDate = loan.ApplicationDate,
                          Reason = loan.Reason,
                          ApproveStatus = loan.ApproveStatus
                      })
                .ToListAsync();
        }

        // GET: api/manager/loans/approved
        [HttpGet("approved")]
        [Authorize(Roles = "manager")]
        public async Task<ActionResult<IEnumerable<LoanDto>>> GetApprovedLoans()
        {
            return await _context.Loans
                .Where(l => l.ApproveStatus)
                .Join(_context.Users,
                      loan => loan.PersonalID,
                      user => user.PersonalID,
                      (loan, user) => new LoanDto
                      {
                          LoanId = loan.LoanId,
                          PersonalID = loan.PersonalID,
                          Name = user.name,
                          Avatar = null,
                          LoanAmount = loan.LoanAmount,
                          DurationMonths = loan.DurationMonths,
                          ApplicationDate = loan.ApplicationDate,
                          Reason = loan.Reason,
                          ApproveStatus = loan.ApproveStatus
                      })
                .ToListAsync();
        }

        // PUT: api/manager/loans/{id}/approve
        [HttpPut("{id}/approve")]
        [Authorize(Roles = "manager")]
        public async Task<IActionResult> ApproveLoan(int id)
        {
            var loan = await _context.Loans.FindAsync(id);
            if (loan == null) return NotFound();
            loan.ApproveStatus = true;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // PUT: api/manager/loans/{id}/reject
        [HttpPut("{id}/reject")]
        [Authorize(Roles = "manager")]
        public async Task<IActionResult> RejectLoan(int id)
        {
            var loan = await _context.Loans.FindAsync(id);
            if (loan == null) return NotFound();
            _context.Loans.Remove(loan);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // GET: api/manager/loans/pdf/{loanId}
        [HttpGet("pdf/{loanId}")]
        [Authorize(Roles = "manager")]
        public async Task<IActionResult> GetLoanPdf(int loanId)
        {
            var loan = await _context.Loans
                .Include(l => l.Manager)
                .FirstOrDefaultAsync(l => l.LoanId == loanId);
            if (loan == null) return NotFound("Loan not found.");

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.PersonalID == loan.PersonalID);
            if (user == null) return NotFound("Client not found.");

            var pdfBytes = _pdfGenerator.GenerateLoanPdf(loan, user);
            return File(pdfBytes, "application/pdf", $"Loan_{loanId}.pdf");
        }
    }
}