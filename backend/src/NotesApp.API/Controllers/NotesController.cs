using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NotesApp.API.Data;
using NotesApp.API.Dtos.Notes;
using NotesApp.API.Models;

namespace NotesApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class NotesController(ApplicationDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<NoteResponse>>> GetAll(CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        var notes = await dbContext.Notes
            .Where(x => x.UserId == userId.Value)
            .OrderByDescending(x => x.UpdatedAtUtc)
            .Select(x => new NoteResponse(x.Id, x.Title, x.Content, x.CreatedAtUtc, x.UpdatedAtUtc))
            .ToListAsync(cancellationToken);

        return Ok(notes);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<NoteResponse>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        var note = await dbContext.Notes
            .Where(x => x.Id == id && x.UserId == userId.Value)
            .Select(x => new NoteResponse(x.Id, x.Title, x.Content, x.CreatedAtUtc, x.UpdatedAtUtc))
            .SingleOrDefaultAsync(cancellationToken);

        if (note is null)
        {
            return NotFound();
        }

        return Ok(note);
    }

    [HttpPost]
    public async Task<ActionResult<NoteResponse>> Create(CreateNoteRequest request, CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        var now = DateTime.UtcNow;
        var note = new Note
        {
            Id = Guid.NewGuid(),
            UserId = userId.Value,
            Title = request.Title.Trim(),
            Content = request.Content?.Trim(),
            CreatedAtUtc = now,
            UpdatedAtUtc = now
        };

        dbContext.Notes.Add(note);
        await dbContext.SaveChangesAsync(cancellationToken);

        var response = new NoteResponse(note.Id, note.Title, note.Content, note.CreatedAtUtc, note.UpdatedAtUtc);
        return CreatedAtAction(nameof(GetById), new { id = note.Id }, response);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<NoteResponse>> Update(Guid id, UpdateNoteRequest request, CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        var note = await dbContext.Notes
            .SingleOrDefaultAsync(x => x.Id == id && x.UserId == userId.Value, cancellationToken);

        if (note is null)
        {
            return NotFound();
        }

        note.Title = request.Title.Trim();
        note.Content = request.Content?.Trim();
        note.UpdatedAtUtc = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);

        var response = new NoteResponse(note.Id, note.Title, note.Content, note.CreatedAtUtc, note.UpdatedAtUtc);
        return Ok(response);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        var note = await dbContext.Notes
            .SingleOrDefaultAsync(x => x.Id == id && x.UserId == userId.Value, cancellationToken);

        if (note is null)
        {
            return NotFound();
        }

        dbContext.Notes.Remove(note);
        await dbContext.SaveChangesAsync(cancellationToken);

        return NoContent();
    }

    private Guid? GetUserId()
    {
        var rawUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.TryParse(rawUserId, out var userId) ? userId : null;
    }
}
