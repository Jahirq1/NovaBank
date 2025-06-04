using Microsoft.AspNetCore.Authorization;  
using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Controllers.Officer
{
    [Authorize] 
    [ApiController]
    [Route("api/officer/search")]
    public class SearchController : ControllerBase
    {
        private readonly NovaBankDbContext _context;
        private readonly IPasswordHasher<User> _passwordHasher;
        public SearchController(NovaBankDbContext context, IPasswordHasher<User> passwordHasher)
        {
            _context = context;
            _passwordHasher = passwordHasher;
        }

        [HttpGet("look")]
        [Authorize(Roles = "officer")]
        public async Task<IActionResult> SearchUsers([FromQuery] string searchTerm)
        {
            var userId = GetUserIdFromToken();
            if (userId == null)
                return Unauthorized("User ID nuk u gjet në token.");

            var users = await _context.Users
                .Where(u => (u.name.Contains(searchTerm) || u.email.Contains(searchTerm) || u.PersonalID.ToString().Contains(searchTerm))
                            && u.role == "user")
                .ToListAsync();

            if (!users.Any())
                return NotFound("Nuk u gjet asnjë përdorues që përputhet me kriteret.");

            return Ok(users);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "officer")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users
                .Include(u => u.SentTransactions)
                .Include(u => u.ReceivedTransactions)
                .Include(u => u.KlientLoans)
                .FirstOrDefaultAsync(u => u.id == id);

            if (user == null)
                return NotFound();

            _context.Transactions.RemoveRange(user.SentTransactions);
            _context.Transactions.RemoveRange(user.ReceivedTransactions);
            _context.KlientLoans.RemoveRange(user.KlientLoans);

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return Ok("Përdoruesi u fshi me sukses.");
        }

        [HttpPut("update/{id}")]
        [Authorize(Roles = "officer")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] User updatedUser)
        {
            if (updatedUser == null)
                return BadRequest("Body is null");

            if (id != updatedUser.id)
                return BadRequest($"ID-ja e përdoruesit nuk përputhet. URL ID: {id}, Body ID: {updatedUser.id}");

            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound("Përdoruesi nuk u gjet.");

            if (!string.IsNullOrEmpty(updatedUser.password))
            {
                user.password = _passwordHasher.HashPassword(user, updatedUser.password);
            }

            user.name = updatedUser.name;
            user.email = updatedUser.email;
            user.phone = updatedUser.phone;
            user.address = updatedUser.address;
            user.city = updatedUser.city;
            user.dateOfBirth = updatedUser.dateOfBirth;
            user.role = updatedUser.role;

            await _context.SaveChangesAsync();

            return Ok("Përdoruesi u përditësua me sukses.");
        }

        private int? GetUserIdFromToken()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserID");
            if (userIdClaim != null && int.TryParse(userIdClaim.Value, out int userId))
                return userId;
            return null;
        }
    }
}
