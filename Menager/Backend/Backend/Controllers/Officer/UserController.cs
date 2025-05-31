using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Backend.Models.DTO;
namespace Backend.Controllers.Officer
{
    [Route("api/officer/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly NovaBankDbContext _context;
        public UserController(NovaBankDbContext context)
        {
            _context = context;
        }
        [HttpPost("create")]
        public async Task<IActionResult> CreateUser(User user)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors)
                                              .Select(e => e.ErrorMessage)
                                              .ToList();
                return BadRequest(new { errors });
            }

            // Kontrollo nëse PersonalID ekziston
            bool personalIdExists = await _context.Users.AnyAsync(u => u.PersonalID == user.PersonalID);
            if (personalIdExists)
            {
                return Conflict(new { message = "PersonalID është përdorur tashmë." });
            }

            // Vendos data e krijimit nëse nuk është dhënë
            if (user.createdDate == null || user.createdDate == default(DateTime))
            {
                user.createdDate = DateTime.UtcNow;
            }

            // Hash password - kontrollo që user.password nuk është null ose bosh
            if (string.IsNullOrEmpty(user.password))
            {
                return BadRequest(new { message = "Fjalëkalimi nuk mund të jetë i zbrazët." });
            }

            var passwordHasher = new PasswordHasher<User>();
            user.password = passwordHasher.HashPassword(user, user.password);

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Për siguri, mund të mos kthejmë password-in e hash-uar
            user.password = null;

            return Ok(user);
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
