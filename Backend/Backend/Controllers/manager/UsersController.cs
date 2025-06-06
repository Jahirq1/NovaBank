﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace Backend.Controllers.manager
{
    [Route("api/manager")]
    [ApiController]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly NovaBankDbContext _context;

        public UsersController(NovaBankDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Authorize(Roles = "manager")]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers(
            [FromQuery] string? role,
            [FromQuery] string? name)
        {
            var query = _context.Users.AsQueryable();

            if (!string.IsNullOrEmpty(role))
                query = query.Where(u => u.role == role);
            if (!string.IsNullOrEmpty(name))
                query = query.Where(u => EF.Functions.Like(u.name, $"%{name}%"));

            return await query.ToListAsync();
        }

        [HttpPost]
        [Authorize(Roles = "manager")]
        public async Task<ActionResult<User>> RegisterUser(User user)
        {
            user.createdDate = DateTime.UtcNow;
            var hasher = new PasswordHasher<User>();
            user.password = hasher.HashPassword(user, user.password);

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUsers), new { id = user.id }, user);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "manager")]
        public async Task<IActionResult> UpdateUser(int id, User updatedUser)
        {
            if (id != updatedUser.id)
                return BadRequest("ID mismatch.");

            var existing = await _context.Users.FindAsync(id);
            if (existing == null)
                return NotFound();

            existing.name = updatedUser.name;
            existing.email = updatedUser.email;
            existing.phone = updatedUser.phone;
            existing.address = updatedUser.address;
            existing.city = updatedUser.city;
            existing.dateOfBirth = updatedUser.dateOfBirth;
            existing.password = updatedUser.password;

            await _context.SaveChangesAsync();
            return Ok(existing);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "manager")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users
                .Include(u => u.SentTransactions)
                .Include(u => u.ReceivedTransactions)
                .Include(u => u.KlientLoans)
                .FirstOrDefaultAsync(u => u.id == id);

            if (user == null)
                return NotFound();

            _context.Transactions.RemoveRange(user.SentTransactions);
            _context.Transactions.RemoveRange(user.ReceivedTransactions);
            _context.KlientLoans.RemoveRange(user.KlientLoans);
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpGet("profile")]
        [Authorize(Roles = "manager")]
        public async Task<ActionResult<User>> GetCurrentProfile()
        {
            var claim = User.FindFirst("UserID")?.Value;
            if (claim == null || !int.TryParse(claim, out var id))
                return Unauthorized();

            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound();

            return Ok(user);
        }

        [HttpPut("profile")]
        [Authorize(Roles = "manager")]
        public async Task<IActionResult> UpdateCurrentProfile([FromBody] User updatedUser)
        {
            var claim = User.FindFirst("UserID")?.Value;
            if (claim == null || !int.TryParse(claim, out var id))
                return Unauthorized();
            if (updatedUser.id != id)
                return BadRequest("Cannot update another user's profile.");

            var existing = await _context.Users.FindAsync(id);
            if (existing == null)
                return NotFound();

            existing.name = updatedUser.name;
            existing.email = updatedUser.email;
            existing.phone = updatedUser.phone;
            existing.address = updatedUser.address;
            existing.city = updatedUser.city;
            existing.dateOfBirth = updatedUser.dateOfBirth;

            await _context.SaveChangesAsync();
            return Ok(existing);
        }
    }
}