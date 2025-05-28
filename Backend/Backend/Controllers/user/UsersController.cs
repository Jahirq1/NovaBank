using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Models;
using Backend.Models.DTO;

namespace NOVA_API.Controllers
{
    [Route("api/Users")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly NovaBankDbContext _context;

        public UsersController(NovaBankDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<User>> RegisterUser(User user)
        {
            user.createdDate = DateTime.UtcNow;

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
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound();

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
        public async Task<IActionResult> UpdateUserProfile(
            int id,
            [FromForm] UserProfileUpdateDto dto)          // ⇠  multipart/form-data
        {
            if (id != dto.id)
                return BadRequest("ID mismatch.");

            var user = await _context.Users.FindAsync(id);
            if (user is null) return NotFound();

            user.name = dto.name;
            user.email = dto.email;
            user.phone = dto.phone;
            user.address = dto.address;
            user.city = dto.city;
            user.dateOfBirth = dto.dateOfBirth;

            await _context.SaveChangesAsync();
            return Ok(user);
        }

        [HttpGet("balance/{id}")]
        public async Task<IActionResult> GetBalance(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound();

            return Ok(user.Balance);
        }

        [HttpGet("spending-limit/{id}")]
        public async Task<IActionResult> GetSpendingLimit(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user is null) return NotFound();

            // për shembull ruhet në kolonën BalanceLimit;
            // nëse s’ke fushë shto Nullable<decimal> SpendingLimit në model
            var limit = user.SpendingLimit ?? 5000m;   // fallback
            return Ok(limit);
        }
    }
}