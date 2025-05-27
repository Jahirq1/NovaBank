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
        private readonly Pdf.PdfGenerator _pdfGenerator;
        public LoansController(NovaBankDbContext context, SessionService sessionService, Pdf.PdfGenerator pdfGenerator)
        {
            _sessionService = sessionService;
            _pdfGenerator = pdfGenerator;
            _context = context;
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


        [HttpPost("create")]
        public async Task<IActionResult> CreateLoan([FromBody] TabelaLoans loanDto)
        {
            var klient = await _context.Users.FirstOrDefaultAsync(u => u.PersonalID == loanDto.PersonalID);
            if (klient == null)
            {
                return BadRequest("Klienti nuk ekziston në sistem. Ju lutem krijoni account para se të aplikoni për kredi.");
            }
            // Kontrollo nëse ekziston menaxheri
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
                ApproveStatus = false,  // default
                viewStatus = false
            };

            _context.Loans.Add(loan);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetLoanById), new { id = loan.LoanId }, loan);
        }

        // GET: api/loans/{id}
        [HttpGet("find/{id}")]
        public async Task<IActionResult> GetLoanById(int id)
        {
            var loan = await _context.Loans
                .Include(l => l.Manager)
                .Include(l => l.KlientLoans)
                    .ThenInclude(kl => kl.Klient)
                .FirstOrDefaultAsync(l => l.LoanId == id);

            if (loan == null)
            {
                return NotFound();
            }

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
public async Task<IActionResult> GetLoanPdf(int loanId)
{
    var loan = await _context.Loans.Include(l => l.Manager)
                                   .FirstOrDefaultAsync(l => l.LoanId == loanId);
    if (loan == null) return NotFound("Kredi nuk u gjet.");

    // Merr userin nga personalId ose userId i kredisë
    var user = await _context.Users.FirstOrDefaultAsync(u => u.PersonalID == loan.PersonalID);
    if (user == null) return NotFound("User nuk u gjet.");

    var pdfBytes = _pdfGenerator.GenerateLoanPdf(loan, user);

    if (pdfBytes == null)
        return NotFound("PDF nuk u krijua.");

    return File(pdfBytes, "application/pdf", $"Loan_{loanId}.pdf");
}

        private bool LoansExists(int id)
        {
            return _context.Loans.Any(e => e.LoanId == id);
        }
    }
}
