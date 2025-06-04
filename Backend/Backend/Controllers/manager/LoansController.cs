using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Models;
using Backend.Pdf;
using Microsoft.AspNetCore.Authorization;
using Backend.Models.DTO;

namespace Backend.Controllers.manager
{
    public class LoanDto
    {
        public int LoanId { get; set; }
        public int PersonalID { get; set; }
        public string Name { get; set; } = "";
        public string? Avatar { get; set; }
        public decimal LoanAmount { get; set; }
        public int DurationMonths { get; set; }
        public DateTime ApplicationDate { get; set; }
        public string Reason { get; set; } = "";
        public string Status { get; set; }  
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

        [HttpGet("pending")]
        [Authorize(Roles = "manager")]
        public async Task<ActionResult<IEnumerable<LoanDto>>> GetPendingLoans()
        {
            return await _context.Loans
                .Where(l => l.Status==LoanStatus.Pending)
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
                          Status = loan.Status.ToString()
                      })
                .ToListAsync();
        }

        [HttpGet("approved")]
        [Authorize(Roles = "manager")]
        public async Task<ActionResult<IEnumerable<LoanDto>>> GetApprovedLoans()
        {
            return await _context.Loans
                .Where(l => l.Status == LoanStatus.Approved)
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
                          Status = loan.Status.ToString() 
                      })
                .ToListAsync();
        }
        [HttpGet("rejected")]
        [Authorize(Roles = "manager")]
        public async Task<ActionResult<IEnumerable<LoanDto>>> GetRejectedLoans()
        {
            return await _context.Loans
                .Where(l => l.Status == LoanStatus.Rejected)
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
                          Status = loan.Status.ToString()
                      })
                .ToListAsync();
        }



        [HttpPut("{id}/approve")]
        [Authorize(Roles = "manager")]
        public async Task<IActionResult> ApproveLoan(int id)
        {
            var loan = await _context.Loans.FindAsync(id);
            if (loan == null) return NotFound();

            if (loan.Status == LoanStatus.Approved)
                return BadRequest("Kredia është veç e aprovuar.");

            var user = await _context.Users.FirstOrDefaultAsync(u => u.PersonalID == loan.PersonalID);
            if (user == null) return NotFound("Përdoruesi nuk u gjet.");

            var account = await _context.Users.FirstOrDefaultAsync(a => a.id == user.id);
            if (account == null) return NotFound("Llogaria e përdoruesit nuk u gjet.");

            loan.Status = LoanStatus.Approved;
            account.Balance += loan.LoanAmount;

            await _context.SaveChangesAsync();

            return NoContent();
        }


        [HttpPut("{id}/reject")]
        [Authorize(Roles = "manager")]
        public async Task<IActionResult> RejectLoan(int id, [FromBody] RejectLoanDto rejectDto)
        {
            var loan = await _context.Loans.FindAsync(id);
            if (loan == null) return NotFound();

            if (loan.Status == LoanStatus.Rejected)
                return BadRequest("Kredia është veç e refuzuar.");

            loan.Status = LoanStatus.Rejected;
            loan.RejectionReason = rejectDto.Reason;

            await _context.SaveChangesAsync();

            return NoContent();
        }


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