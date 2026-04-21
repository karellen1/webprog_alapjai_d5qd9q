namespace NotesApp.API.Models;

public class Note
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    public AppUser? User { get; set; }

    public string Title { get; set; } = string.Empty;

    public string? Content { get; set; }

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAtUtc { get; set; } = DateTime.UtcNow;
}
