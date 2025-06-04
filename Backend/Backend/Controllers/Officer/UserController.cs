using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Backend.Models.DTO;
using System.Linq;
using System.Threading.Tasks;
using System;

namespace Backend.Controllers.Officer
{
    [Authorize] 
    [Route("api/officer/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly NovaBankDbContext _context;
        private readonly IPasswordHasher<User> _passwordHasher;

        public UserController(NovaBankDbContext context, IPasswordHasher<User> passwordHasher)
        {
            _context = context;
            _passwordHasher = passwordHasher;
        }

        [AllowAnonymous]  
        [HttpPost("create")]
        [Authorize(Roles = "officer")]
        public async Task<IActionResult> CreateUser(User user)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors)
                                              .Select(e => e.ErrorMessage)
                                              .ToList();
                return BadRequest(new { errors });
            }

            bool personalIdExists = await _context.Users.AnyAsync(u => u.PersonalID == user.PersonalID);
            if (personalIdExists)
            {
                return Conflict(new { message = "PersonalID është përdorur tashmë." });
            }

            if (user.createdDate == null || user.createdDate == default(DateTime))
            {
                user.createdDate = DateTime.UtcNow;
            }

            if (string.IsNullOrEmpty(user.password))
            {
                return BadRequest(new { message = "Fjalëkalimi nuk mund të jetë i zbrazët." });
            }

            user.password = _passwordHasher.HashPassword(user, user.password);

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            user.password = null;

            return Ok(user);
        }

        [HttpGet("take/{id}")]
        [Authorize(Roles = "officer")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
                return NotFound();

            user.password = null; 

            return user;
        }

        [HttpPut("update/{id}")]
        [Authorize(Roles = "officer")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] User updatedUser)
        {
            if (id != updatedUser.id)
                return BadRequest("User ID mismatch.");

            var user = await _context.Users.FindAsync(id);

            if (user == null)
                return NotFound();

            if (!string.IsNullOrEmpty(updatedUser.password) && updatedUser.password != user.password)
            {
                user.password = _passwordHasher.HashPassword(user, updatedUser.password);
            }

            user.name = updatedUser.name;
            user.email = updatedUser.email;
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
