using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace Backend.Controllers
{
    [Route("api/manager")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly NovaBankDbContext _context;

        public UsersController(NovaBankDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers(
        [FromQuery] string? role,
        [FromQuery] string? name)
        {
            var q = _context.Users.AsQueryable();

            if (!string.IsNullOrEmpty(role))
                q = q.Where(u => u.role == role);          // role==="officer"

            if (!string.IsNullOrEmpty(name))
                q = q.Where(u => EF.Functions.Like(u.name, $"%{name}%"));

            return await q.ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<User>> RegisterUser(User user)
        {
            user.createdDate = DateTime.UtcNow;

            var passwordHasher = new PasswordHasher<User>();
            user.password = passwordHasher.HashPassword(user, user.password);

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUsers), new { id = user.id }, user);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] User updatedUser)
        {
            if (id != updatedUser.id)
                return BadRequest("ID mismatch.");

            var existingUser = await _context.Users.FindAsync(id);
            if (existingUser == null)
                return NotFound();

            existingUser.name = updatedUser.name;
            existingUser.email = updatedUser.email;
            existingUser.phone = updatedUser.phone;
            existingUser.address = updatedUser.address;
            existingUser.city = updatedUser.city;
            existingUser.dateOfBirth = updatedUser.dateOfBirth;
            existingUser.password = updatedUser.password;

            await _context.SaveChangesAsync();
            return Ok(existingUser);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users
                .Include(u => u.SentTransactions)
                .Include(u => u.ReceivedTransactions)
                .Include(u => u.KlientLoans)
                .FirstOrDefaultAsync(u => u.id == id);

            if (user == null)
                return NotFound();

            // Fshi manualisht të dhënat e lidhura
            _context.Transactions.RemoveRange(user.SentTransactions);
            _context.Transactions.RemoveRange(user.ReceivedTransactions);
            _context.KlientLoans.RemoveRange(user.KlientLoans);

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return NoContent();
        }


        [HttpGet("profile/{id}")]
        public async Task<ActionResult<User>> GetUserProfile(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

        [HttpPut("profile/{id}")]
        public async Task<IActionResult> UpdateUserProfile(int id, [FromBody] User updatedUser)
        {
            if (id != updatedUser.id)
                return BadRequest("ID mismatch.");

            var existingUser = await _context.Users.FindAsync(id);
            if (existingUser == null)
                return NotFound();

            existingUser.name = updatedUser.name;
            existingUser.email = updatedUser.email;
            existingUser.phone = updatedUser.phone;
            existingUser.address = updatedUser.address;
            existingUser.city = updatedUser.city;
            existingUser.dateOfBirth = updatedUser.dateOfBirth;

            await _context.SaveChangesAsync();
            return Ok(existingUser);
        }
    }
}