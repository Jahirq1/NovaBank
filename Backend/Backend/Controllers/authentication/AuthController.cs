using Backend.Models.DTO;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Backend.Controllers.authentication
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IPasswordHasher<User> _passwordHasher;
        private readonly TokenService _tokenService;
      private readonly NovaBankDbContext _context;

        private int? GetUserIdFromToken()
        {
            var userIdClaim = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier || c.Type == "UserID");
            if (userIdClaim != null && int.TryParse(userIdClaim.Value, out int userId))
                return userId;
            return null;
        }

        public AuthController(TokenService tokenService, IPasswordHasher<User> passwordHasher, NovaBankDbContext context)
        {
            _tokenService = tokenService;
            _passwordHasher = passwordHasher;
            _context = context;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            var user = _context.Users
                .AsNoTracking()
                .FirstOrDefault(u => u.PersonalID == request.personalId);

            if (user == null)
                return Unauthorized("Personal ID ose fjalëkalimi i gabuar.");

            var result = _passwordHasher.VerifyHashedPassword(user, user.password, request.password);

            if (result == PasswordVerificationResult.Failed)
                return Unauthorized("Personal ID ose fjalëkalimi i gabuar.");

            var tokens = _tokenService.GenerateTokens(user);

            // Vendos token-in në cookie HttpOnly (shembull me AccessToken)
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = false, // Në development vendos false, në prod vendos true
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddDays(1)
            };

            Response.Cookies.Append("accessToken", tokens.AccessToken, cookieOptions);

            // Nëse ke refresh token, mund ta vendosësh po ashtu në cookie:
            // Response.Cookies.Append("refreshToken", tokens.RefreshToken, cookieOptions);

            // Kthe vetëm info që dëshiron në frontend (pa token)
            return Ok(new { role = user.role });
        }
        [HttpGet("me")]
        public IActionResult GetCurrentUser()
        {
            var userId = GetUserIdFromToken();
            if (userId == null)
                return Unauthorized();

            var user = _context.Users.FirstOrDefault(u => u.id == userId);
            if (user == null)
                return NotFound();

            return Ok(new
            {
                user.id,
                user.name,
                user.email,
                user.address,
                user.dateOfBirth,
                user.PersonalID,
                user.phone
                // ose çdo info që duhet për managerId
            });
        }


        [HttpPost("refresh")]
        public IActionResult Refresh([FromBody] TokenRequest request)
        {
            var refreshToken = _context.RefreshTokens
                .Include(rt => rt.User)
                .FirstOrDefault(rt => rt.Token == request.RefreshToken && rt.Expiration > DateTime.UtcNow);

            if (refreshToken == null)
                return Unauthorized("Token i rifreskimit nuk është i vlefshëm.");

            var tokens = _tokenService.GenerateTokens(refreshToken.User);
            return Ok(tokens);
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            // Merr refreshToken nga cookie
            if (Request.Cookies.TryGetValue("refreshToken", out var refreshToken))
            {
                _tokenService.RevokeRefreshToken(refreshToken);
            }

            // Fshi cookie nga klienti nëse dëshiron
            Response.Cookies.Delete("refreshToken");
            Response.Cookies.Delete("accessToken");

            return NoContent();
        }

    }
}

