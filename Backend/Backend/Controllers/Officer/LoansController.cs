using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Models;
using Backend.Models.DTO;

namespace Backend.Controllers.Officer
{
    [Authorize]
    [Route("api/officer/loans")]
    [ApiController]
    public class LoansController : ControllerBase
    {
        private readonly NovaBankDbContext _context;
        private readonly Pdf.PdfGenerator _pdfGenerator;

        public LoansController(NovaBankDbContext context, Pdf.PdfGenerator pdfGenerator)
        {
            _context = context;
            _pdfGenerator = pdfGenerator;
        }

        [HttpGet("my-loans-count")]
        [Authorize(Roles = "officer")]
        public IActionResult GetMyLoansCount()
        {
            var userId = GetUserIdFromToken();
            if (userId == null)
                return Unauthorized(new { message = "User ID not found or invalid in token" });

            var exists = _context.Users.Any(u => u.id == userId);
            if (!exists)
                return Unauthorized(new { message = "User not found" });

            var loansCount = _context.KlientLoans
                .Count(kl => kl.KlientId == userId);

            return Ok(new { totalLoans = loansCount });
        }

        [HttpGet("my-loans")]
        [Authorize(Roles = "officer")]
        public async Task<IActionResult> GetMyLoans()
        {
            var userId = GetUserIdFromToken();
            if (userId == null)
                return Unauthorized(new { message = "User ID not found or invalid in token" });

            var loans = await _context.KlientLoans
                .Where(kl => kl.KlientId == userId)
                .Include(kl => kl.Loan)
                .Select(kl => new
                {
                    kl.Loan.LoanId,
                    kl.Loan.LoanAmount,
                    kl.Loan.ApplicationDate,
                    kl.Loan.ApproveStatus,
                    kl.Loan.DurationMonths
                })
                .ToListAsync();

            return Ok(loans);
        }

        [HttpPost("create")]
        [Authorize(Roles = "officer")]
        public async Task<IActionResult> CreateLoan([FromBody] TabelaLoans loanDto)
        {
            var klient = await _context.Users.FirstOrDefaultAsync(u => u.PersonalID == loanDto.PersonalID);
            if (klient == null)
            {
                return BadRequest("Klienti nuk ekziston në sistem. Ju lutem krijoni account para se të aplikoni për kredi.");
            }

            var manager = await _context.Users.FindAsync(loanDto.ManagerId);
            if (manager == null)
            {
                return BadRequest("Manageri nuk ekziston.");
            }

            var loan = new Loans
            {
                PersonalID = loanDto.PersonalID,
                ApplicationDate = loanDto.ApplicationDate,
                WorkingStatus = loanDto.WorkingStatus,
                MonthlyIncome = loanDto.MonthlyIncome,
                LoanAmount = loanDto.LoanAmount,
                Reason = loanDto.Reason,
                DurationMonths = loanDto.DurationMonths,
                Collateral = loanDto.Collateral,
                ManagerId = loanDto.ManagerId,
                ApproveStatus = false,
                viewStatus = false
            };

            _context.Loans.Add(loan);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetLoanById), new { id = loan.LoanId }, loan);
        }

        [HttpGet("find/{id}")]
        [Authorize(Roles = "officer")]
        public async Task<IActionResult> GetLoanById(int id)
        {
            var loan = await _context.Loans
                .Include(l => l.Manager)
                .Include(l => l.KlientLoans)
                    .ThenInclude(kl => kl.Klient)
                .FirstOrDefaultAsync(l => l.LoanId == id);

            if (loan == null)
                return NotFound();

            return Ok(new
            {
                loan.LoanId,
                loan.PersonalID,
                loan.ApplicationDate,
                loan.WorkingStatus,
                loan.MonthlyIncome,
                loan.LoanAmount,
                loan.Reason,
                loan.DurationMonths,
                loan.Collateral,
                loan.ApproveStatus,
                Manager = new
                {
                    loan.Manager.id,
                    loan.Manager.name,
                    loan.Manager.email
                },
                Clients = loan.KlientLoans.Select(kl => new
                {
                    kl.Klient.id,
                    kl.Klient.name,
                    kl.Klient.email
                })
            });
        }

        [HttpGet("status")]
        [Authorize(Roles = "officer")]
        public async Task<IActionResult> GetLoansStatus()
        {
            var loans = await _context.Loans
                .Select(l => new
                {
                    l.LoanId,
                    l.PersonalID,
                    l.LoanAmount,
                    l.ApproveStatus
                })
                .ToListAsync();

            return Ok(loans);
        }

        [HttpGet("pdf/{loanId}")]
        [Authorize(Roles = "officer")]
        public async Task<IActionResult> GetLoanPdf(int loanId)
        {
            var loan = await _context.Loans.Include(l => l.Manager)
                                           .FirstOrDefaultAsync(l => l.LoanId == loanId);
            if (loan == null)
                return NotFound("Kredi nuk u gjet.");

            var user = await _context.Users.FirstOrDefaultAsync(u => u.PersonalID == loan.PersonalID);
            if (user == null)
                return NotFound("User nuk u gjet.");

            var pdfBytes = _pdfGenerator.GenerateLoanPdf(loan, user);
            if (pdfBytes == null)
                return NotFound("PDF nuk u krijua.");

            return File(pdfBytes, "application/pdf", $"Loan_{loanId}.pdf");
        }

        private int? GetUserIdFromToken()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserID");
            if (userIdClaim != null && int.TryParse(userIdClaim.Value, out int userId))
                return userId;
            return null;
        }

        private bool LoansExists(int id)
        {
            return _context.Loans.Any(e => e.LoanId == id);
        }
    }
}
