using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using NotesApp.API.Dtos.Auth;
using NotesApp.API.Models;
using NotesApp.API.Services;

namespace NotesApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, JwtTokenService tokenService)
    : ControllerBase
{
    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
    {
        var existingUser = await userManager.FindByEmailAsync(request.Email);
        if (existingUser is not null)
        {
            return Conflict(new { message = "Email is already registered." });
        }

        var user = new AppUser
        {
            Id = Guid.NewGuid(),
            UserName = request.Email,
            Email = request.Email,
            CreatedAtUtc = DateTime.UtcNow,
            EmailConfirmed = true
        };

        var result = await userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
        {
            return BadRequest(new
            {
                message = "Registration failed.",
                errors = result.Errors.Select(e => e.Description)
            });
        }

        var (token, expiresAtUtc) = tokenService.CreateToken(user);
        return Ok(new AuthResponse(token, expiresAtUtc));
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
    {
        var user = await userManager.FindByEmailAsync(request.Email);
        if (user is null)
        {
            return Unauthorized(new { message = "Invalid credentials." });
        }

        var passwordCheck = await signInManager.CheckPasswordSignInAsync(user, request.Password, lockoutOnFailure: false);
        if (!passwordCheck.Succeeded)
        {
            return Unauthorized(new { message = "Invalid credentials." });
        }

        var (token, expiresAtUtc) = tokenService.CreateToken(user);
        return Ok(new AuthResponse(token, expiresAtUtc));
    }
}
