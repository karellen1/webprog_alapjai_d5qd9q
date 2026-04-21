namespace NotesApp.API.Dtos.Auth;

public record AuthResponse(string AccessToken, DateTime ExpiresAtUtc);
