namespace Backend.Controllers.authentication
{
    using System.IdentityModel.Tokens.Jwt;
    using System.Security.Claims;
    using System.Security.Cryptography;
    using System.Text;
    using Backend.Models;
    using Backend.Models.DTO;
    using Microsoft.IdentityModel.Tokens;

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
            var secretKey = _configuration["JwtSettings:SecretKey"];
            var key = Encoding.UTF8.GetBytes(secretKey);

            var symmetricKey = new SymmetricSecurityKey(key);
            var signingCredentials = new SigningCredentials(symmetricKey, SecurityAlgorithms.HmacSha256);

            var tokenHandler = new JwtSecurityTokenHandler();
            var claims = new[]
            {
        new Claim("UserID", user.id.ToString()),
        new Claim("PersonalID", user.PersonalID.ToString()),
        new Claim(ClaimTypes.Role, user.role)
    };

            var accessTokenExpirationMinutes = double.Parse(_configuration["JwtSettings:AccessTokenExpirationMinutes"]);
            var refreshTokenExpirationDays = int.Parse(_configuration["JwtSettings:RefreshTokenExpirationDays"]);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(accessTokenExpirationMinutes),
                Issuer = _configuration["JwtSettings:Issuer"],
                Audience = _configuration["JwtSettings:Audience"],
                SigningCredentials = signingCredentials
            };

            var accessToken = tokenHandler.WriteToken(tokenHandler.CreateToken(tokenDescriptor));
            var refreshToken = Guid.NewGuid().ToString();

            // Ruaj refresh token në DB
            var refreshTokenEntity = new RefreshToken
            {
                Token = refreshToken,
                Expiration = DateTime.UtcNow.AddDays(refreshTokenExpirationDays),
                UserId = user.id
            };

            _context.RefreshTokens.Add(refreshTokenEntity);
            _context.SaveChanges();

            return new AuthResponse
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                Role = user.role,
                UserId = user.id,
                Message = "Login successful"
            };
        }





        public bool ValidateRefreshToken(string refreshToken)
        {
            var tokenInfo = _context.RefreshTokens.FirstOrDefault(rt => rt.Token == refreshToken);
            return tokenInfo != null && tokenInfo.Expiration > DateTime.UtcNow;
        }

        public void RevokeRefreshToken(string refreshToken)
        {
            var token = _context.RefreshTokens.FirstOrDefault(rt => rt.Token == refreshToken);
            if (token != null)
            {
                _context.RefreshTokens.Remove(token);
                _context.SaveChanges();
            }
        }

    }
}
