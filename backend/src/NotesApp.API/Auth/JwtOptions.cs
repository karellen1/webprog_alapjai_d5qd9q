namespace NotesApp.API.Auth;

public class JwtOptions
{
    public const string SectionName = "Jwt";

    public string Key { get; set; } = string.Empty;

    public string Issuer { get; set; } = "NotesApp";

    public string Audience { get; set; } = "NotesApp.Client";

    public int ExpiryMinutes { get; set; } = 120;
}
