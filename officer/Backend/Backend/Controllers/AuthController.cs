using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using System.Linq;
using Backend.Services;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly NovaBankDbContext _context;
        private readonly SessionService _sessionService;

        public AuthController(NovaBankDbContext context, SessionService sessionService)
        {
            _context = context;
            _sessionService = sessionService;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] Models.LoginRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = _context.Users
            .FirstOrDefault(u => u.PersonalID == request.personalId && u.password == request.password);

            if (user == null)
                return Unauthorized(new { message = "Invalid credentials" });

            // Përdor SessionService për të vendosur UserId dhe UserRole në sesion
            _sessionService.SetUserId(user.id);
            HttpContext.Session.SetString("UserRole", user.role);

            return Ok(new { message = "Login successful", role = user.role, userId = user.id });
        }

        [HttpGet("test-session")]
        public IActionResult TestSession()
        {
            var userId = _sessionService.GetUserId();
            if (userId == null)
                return Ok("No UserId in session");

            return Ok($"UserId in session: {userId}");
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


    }
}
