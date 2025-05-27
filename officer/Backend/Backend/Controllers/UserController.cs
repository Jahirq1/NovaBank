using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly NovaBankDbContext _context;
        public UserController(NovaBankDbContext context)
        {
            _context = context;
        }

        // GET: api/user/5
        [HttpGet("take/{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        // PUT: api/user/5
        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateUser(int id, User updatedUser)
        {
            if (id != updatedUser.id)
            {
                return BadRequest("User ID mismatch.");
            }

            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            // Përditësimi i fushave
            user.name = updatedUser.name;
            user.email = updatedUser.email;
            user.password = updatedUser.password;
            user.dateOfBirth = updatedUser.dateOfBirth;
            user.Balance = updatedUser.Balance;
            user.role = updatedUser.role;
            user.phone = updatedUser.phone;
            user.address = updatedUser.address;
            user.city = updatedUser.city;

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                return StatusCode(500, "Problem gjatë ruajtjes së të dhënave.");
            }

            return NoContent();
        }
    }
}
