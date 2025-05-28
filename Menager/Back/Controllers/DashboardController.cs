using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/dashboard")]
    public class DashboardController : ControllerBase
    {
        private readonly NovaBankDbContext _context;

        public DashboardController(NovaBankDbContext context)
        {
            _context = context;
        }

        // GET: api/dashboard/summary
        [HttpGet("summary")]
        public async Task<IActionResult> GetSummary()
        {
            var totalBalance = await _context.Users.SumAsync(u => u.Balance);
            var totalUsers = await _context.Users.CountAsync();
            var totalOfficers = await _context.Users.CountAsync(u => u.role.ToLower() == "officer");

            return Ok(new
            {
                totalBalance,
                totalUsers,
                totalOfficers
            });
        }

        [HttpGet("user-registrations/monthly")]
        public async Task<IActionResult> GetMonthlyUserRegistrations()
        {
            var registrations = await _context.Users
                .Where(u => u.createdDate != null)
                .GroupBy(u => new { u.createdDate.Value.Year, u.createdDate.Value.Month })
                .OrderBy(g => g.Key.Year).ThenBy(g => g.Key.Month)
                .Select(g => new
                {
                    month = $"{g.Key.Year}-{g.Key.Month:D2}", // format: "2025-05"
                    count = g.Count()
                })
                .ToListAsync();

            return Ok(registrations);
        }
    }
}
