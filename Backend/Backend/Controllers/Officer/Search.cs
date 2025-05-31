using Microsoft.AspNetCore.Mvc;
using Backend.Models;

using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace Backend.Controllers.Officer
{
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

        // GET: /api/search/look?searchTerm=xxx
        [HttpGet("look")]
        public async Task<IActionResult> SearchUsers([FromQuery] string searchTerm)
        {
            var users = await _context.Users
                .Where(u => (u.name.Contains(searchTerm) || u.email.Contains(searchTerm) || u.PersonalID.ToString().Contains(searchTerm))
                            && u.role == "user")  // filtro vetëm me role "user"
                .ToListAsync();

            if (!users.Any())
                return NotFound("Nuk u gjet asnjë përdorues që përputhet me kriteret.");

            return Ok(users);
        }


        // DELETE: /api/search/delete/5
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
            return Ok("perdoruesi u shly me sukses");
        }

        // PUT: /api/search/update/5
        [HttpPut("update/{id}")]
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
    }
}
