using System;
using System.Linq;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Backend.Models;
using Backend.Models.DTO;

namespace Backend.Controllers.authentication
{
    public class TokenService
    {
        private readonly IConfiguration _configuration;
        private readonly NovaBankDbContext _context;

        public TokenService(IConfiguration configuration, NovaBankDbContext context)
        {
            _configuration = configuration;
            _context = context;
        }

        public AuthResponse GenerateTokens(User user)
        {
            // Read settings
            var secretKey = _configuration["JwtSettings:SecretKey"];
            var keyBytes = Encoding.UTF8.GetBytes(secretKey);

            // Create signing credentials
            var symmetricKey = new SymmetricSecurityKey(keyBytes);
            var signingCreds = new SigningCredentials(symmetricKey, SecurityAlgorithms.HmacSha256);

            // Define claims
            var claims = new[]
            {
                new Claim("UserID",      user.id.ToString()),
                new Claim("PersonalID",  user.PersonalID.ToString()),
                new Claim(ClaimTypes.Role, user.role)
            };

            // Token expirations
            var accessExpiryMinutes = double.Parse(_configuration["JwtSettings:AccessTokenExpirationMinutes"]);
            var refreshExpiryDays = int.Parse(_configuration["JwtSettings:RefreshTokenExpirationDays"]);

            // Build token descriptor
            var descriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(accessExpiryMinutes),
                Issuer = _configuration["JwtSettings:Issuer"],
                Audience = _configuration["JwtSettings:Audience"],
                SigningCredentials = signingCreds
            };

            // Generate tokens
            var handler = new JwtSecurityTokenHandler();
            var accessToken = handler.WriteToken(handler.CreateToken(descriptor));
            var refreshToken = Guid.NewGuid().ToString();

            // (Optional) Clean up old tokens for user
            var oldTokens = _context.RefreshTokens.Where(rt => rt.UserId == user.id);
            if (oldTokens.Any())
            {
                _context.RefreshTokens.RemoveRange(oldTokens);
                _context.SaveChanges();
            }

            // Save new refresh token
            var refreshEntity = new RefreshToken
            {
                Token = refreshToken,
                Expiration = DateTime.UtcNow.AddDays(refreshExpiryDays),
                UserId = user.id
            };
            _context.RefreshTokens.Add(refreshEntity);
            _context.SaveChanges();

            // Return payload
            return new AuthResponse
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                Role = user.role,
                UserId = user.id
            };
        }

        public bool ValidateRefreshToken(string refreshToken)
        {
            var entry = _context.RefreshTokens.FirstOrDefault(rt => rt.Token == refreshToken);
            return entry != null && entry.Expiration > DateTime.UtcNow;
        }

        public void RevokeRefreshToken(string refreshToken)
        {
            var entry = _context.RefreshTokens.FirstOrDefault(rt => rt.Token == refreshToken);
            if (entry != null)
            {
                _context.RefreshTokens.Remove(entry);
                _context.SaveChanges();
            }
        }
    }
}
