using Backend.Data;
using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using System.Linq;
using Backend.Services;
using Microsoft.AspNetCore.Identity.Data;

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
    }
}
