using Backend.Models.DTO;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
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


        public AuthController(TokenService tokenService, IPasswordHasher<User> passwordHasher, NovaBankDbContext context)
        {
            _tokenService = tokenService;
            _passwordHasher = passwordHasher;
            _context = context;
        }

        [HttpGet("me")]
        [Authorize]
        public IActionResult Me()
        {
            var userId = User.FindFirst("UserID")?.Value;
            var personalId = User.FindFirst("PersonalID")?.Value;
            var role = User.FindFirst(ClaimTypes.Role)?.Value ?? "user";

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            return Ok(new
            {
                userId = int.Parse(userId),
                personalId,
                role
            });
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
                Expires = DateTime.UtcNow.AddMinutes(60)
            };

            Response.Cookies.Append("accessToken", tokens.AccessToken, cookieOptions);

            // Nëse ke refresh token, mund ta vendosësh po ashtu në cookie:
            // Response.Cookies.Append("refreshToken", tokens.RefreshToken, cookieOptions);

            // Kthe vetëm info që dëshiron në frontend (pa token)
            return Ok(new { role = user.role });
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
        public IActionResult Logout([FromBody] TokenRequest request)
        {
            _tokenService.RevokeRefreshToken(request.RefreshToken);
            return NoContent();
        }
    }
}