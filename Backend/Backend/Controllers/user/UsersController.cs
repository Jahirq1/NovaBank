using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Models;
using Backend.Models.DTO;

namespace NOVA_API.Controllers;

[ApiController]
[Route("api/users")]
public class UsersController : ControllerBase
{
    private readonly NovaBankDbContext _db;
    public UsersController(NovaBankDbContext db) => _db = db;

    // 🔁 helper që përputhet me tokenin tënd ("UserID")
    private int? CurrentUserId =>
        int.TryParse(User.FindFirst("UserID")?.Value, out var id) ? id : null;

    [HttpPost]
    public async Task<ActionResult<User>> RegisterUser(User user)
    {
        user.createdDate = DateTime.UtcNow;
        _db.Users.Add(user);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetMyProfile), new { }, user);
    }

    [HttpGet("profile")]
    [Authorize]
    public async Task<ActionResult<User>> GetMyProfile()
    {
        if (CurrentUserId is null) return Unauthorized();
        var user = await _db.Users.FindAsync(CurrentUserId);
        return user is null ? NotFound() : Ok(user);
    }

    [HttpPut("profile")]
    [Authorize]
    public async Task<IActionResult> UpdateMyProfile([FromForm] UserProfileUpdateDto dto)
    {
        if (CurrentUserId is null) return Unauthorized();
        var user = await _db.Users.FindAsync(CurrentUserId);
        if (user is null) return NotFound();

        user.name = dto.name;
        user.email = dto.email;
        user.phone = dto.phone;
        user.address = dto.address;
        user.city = dto.city;
        user.dateOfBirth = dto.dateOfBirth;

        await _db.SaveChangesAsync();
        return Ok(user);
    }

    [HttpGet("balance")]
    [Authorize]
    public async Task<IActionResult> GetMyBalance()
    {
        if (CurrentUserId is null) return Unauthorized();
        var user = await _db.Users.FindAsync(CurrentUserId);
        return user is null ? NotFound() : Ok(user.Balance);
    }

    [HttpGet("spending-limit")]
    [Authorize]
    public async Task<IActionResult> GetMySpendingLimit()
    {
        if (CurrentUserId is null) return Unauthorized();
        var user = await _db.Users.FindAsync(CurrentUserId);
        if (user is null) return NotFound();

        return Ok(user.SpendingLimit ?? 5000m);
    }
}
