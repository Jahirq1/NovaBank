using Backend.Models.DTO;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;

namespace Backend.Controllers.authentication
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IPasswordHasher<User> _passwordHasher;
        private readonly TokenService _tokenService;
        private readonly NovaBankDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(
            TokenService tokenService,
            IPasswordHasher<User> passwordHasher,
            NovaBankDbContext context,
            IConfiguration configuration)
        {
            _tokenService    = tokenService;
            _passwordHasher  = passwordHasher;
            _context         = context;
            _configuration   = configuration;
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

            // Cookie options for access token
            var accessOpts = new CookieOptions
            {
                HttpOnly = true,
                Secure   = false, // true in production
                SameSite = SameSiteMode.Strict,
                Expires  = DateTime.UtcNow.AddMinutes(
                    double.Parse(_configuration["JwtSettings:AccessTokenExpirationMinutes"]))
            };

            // Cookie options for refresh token
            var refreshOpts = new CookieOptions
            {
                HttpOnly = true,
                Secure   = false,
                SameSite = SameSiteMode.Strict,
                Expires  = DateTime.UtcNow.AddDays(
                    int.Parse(_configuration["JwtSettings:RefreshTokenExpirationDays"]))
            };

            // Append tokens as HttpOnly cookies
            Response.Cookies.Append("accessToken",  tokens.AccessToken,  accessOpts);
            Response.Cookies.Append("refreshToken", tokens.RefreshToken, refreshOpts);

            // Return session info (frontend uses these)
            return Ok(new { role = user.role, userId = user.id });
        }

        [HttpPost("refresh")]
        public IActionResult Refresh()
        {
            // Read refresh token from cookie
            var cookie = Request.Cookies["refreshToken"];
            if (string.IsNullOrEmpty(cookie))
                return Unauthorized("Nuk u gjet tokeni i rifreskimit.");

            // Validate and load associated refresh token entity
            var rtEntity = _context.RefreshTokens
                .Include(rt => rt.User)
                .FirstOrDefault(rt => rt.Token == cookie && rt.Expiration > DateTime.UtcNow);

            if (rtEntity == null)
                return Unauthorized("Token i rifreskimit i pavlefshëm ose i skaduar.");

            // Generate new tokens
            var tokens = _tokenService.GenerateTokens(rtEntity.User);

            // Reuse cookie options
            var accessOpts = new CookieOptions
            {
                HttpOnly = true,
                Secure   = false,
                SameSite = SameSiteMode.Strict,
                Expires  = DateTime.UtcNow.AddMinutes(
                    double.Parse(_configuration["JwtSettings:AccessTokenExpirationMinutes"]))
            };
            var refreshOpts = new CookieOptions
            {
                HttpOnly = true,
                Secure   = false,
                SameSite = SameSiteMode.Strict,
                Expires  = DateTime.UtcNow.AddDays(
                    int.Parse(_configuration["JwtSettings:RefreshTokenExpirationDays"]))
            };

            // Reset cookies
            Response.Cookies.Append("accessToken",  tokens.AccessToken,  accessOpts);
            Response.Cookies.Append("refreshToken", tokens.RefreshToken, refreshOpts);

            // Return updated session info
            return Ok(new { role = rtEntity.User.role, userId = rtEntity.User.id });
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            // Revoke refresh token in database
            var rtCookie = Request.Cookies["refreshToken"];
            if (!string.IsNullOrEmpty(rtCookie))
                _tokenService.RevokeRefreshToken(rtCookie);

            // Delete cookies
            Response.Cookies.Delete("accessToken");
            Response.Cookies.Delete("refreshToken");

            return NoContent();
        }
    }
}
