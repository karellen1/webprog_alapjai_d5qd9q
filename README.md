# NotesApp

Minimal backend starter for the Web Programming assignment.

## Local setup (backend + Postgres)

1. Copy `.env.example` to `.env` and set your local values.
2. Sync secrets from `.env` to .NET User Secrets:
   `./scripts/setup-user-secrets-from-env.ps1`
3. Start PostgreSQL:
   `docker compose up -d postgres`
4. Run API:
   `dotnet run --project backend/src/NotesApp.API/NotesApp.API.csproj`

## Why User Secrets?

Sensitive values (like DB connection strings) must not be committed. Each developer must run the setup script once per machine/profile.
