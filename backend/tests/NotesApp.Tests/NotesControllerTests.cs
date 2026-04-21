using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NotesApp.API.Controllers;
using NotesApp.API.Data;
using NotesApp.API.Dtos.Notes;
using NotesApp.API.Models;

namespace NotesApp.Tests;

public class NotesControllerTests
{
    [Fact]
    public async Task GetAll_ReturnsUnauthorized_WhenUserClaimMissing()
    {
        using var dbContext = CreateDbContext();
        var controller = CreateController(dbContext, userId: null);

        var result = await controller.GetAll(CancellationToken.None);

        Assert.IsType<UnauthorizedResult>(result.Result);
    }

    [Fact]
    public async Task Create_And_GetAll_ReturnsOnlyCurrentUsersNotes()
    {
        using var dbContext = CreateDbContext();
        var currentUserId = Guid.NewGuid();
        var otherUserId = Guid.NewGuid();

        dbContext.Notes.Add(new Note
        {
            Id = Guid.NewGuid(),
            UserId = otherUserId,
            Title = "Other user note",
            Content = "Should not be visible",
            CreatedAtUtc = DateTime.UtcNow,
            UpdatedAtUtc = DateTime.UtcNow
        });
        await dbContext.SaveChangesAsync();

        var controller = CreateController(dbContext, currentUserId);

        var createResult = await controller.Create(
            new CreateNoteRequest { Title = "  My note  ", Content = "  Mine  " },
            CancellationToken.None);

        var createdAt = Assert.IsType<CreatedAtActionResult>(createResult.Result);
        var created = Assert.IsType<NoteResponse>(createdAt.Value);
        Assert.Equal("My note", created.Title);
        Assert.Equal("Mine", created.Content);

        var listResult = await controller.GetAll(CancellationToken.None);
        var ok = Assert.IsType<OkObjectResult>(listResult.Result);
        var notes = Assert.IsAssignableFrom<IReadOnlyList<NoteResponse>>(ok.Value);

        Assert.Single(notes);
        Assert.Equal(created.Id, notes[0].Id);
    }

    private static ApplicationDbContext CreateDbContext()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase($"notes-tests-{Guid.NewGuid()}")
            .Options;

        return new ApplicationDbContext(options);
    }

    private static NotesController CreateController(ApplicationDbContext dbContext, Guid? userId)
    {
        var controller = new NotesController(dbContext);

        var identity = new ClaimsIdentity();
        if (userId.HasValue)
        {
            identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, userId.Value.ToString()));
        }

        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext
            {
                User = new ClaimsPrincipal(identity)
            }
        };

        return controller;
    }
}
