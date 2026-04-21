using System.ComponentModel.DataAnnotations;

namespace NotesApp.API.Dtos.Notes;

public class UpdateNoteRequest
{
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(10000)]
    public string? Content { get; set; }
}
