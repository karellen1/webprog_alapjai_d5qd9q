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

## Useful endpoints

1. Health check: `GET /health`
2. OpenAPI JSON (development): `GET /openapi/v1.json`
3. Scalar API UI (development): `GET /scalar/v1`
4. Auth register: `POST /api/auth/register`
5. Auth login: `POST /api/auth/login`
6. Notes list (auth): `GET /api/notes`
7. Notes get by id (auth): `GET /api/notes/{id}`
8. Notes create (auth): `POST /api/notes`
9. Notes update (auth): `PUT /api/notes/{id}`
10. Notes delete (auth): `DELETE /api/notes/{id}`

## Why User Secrets?

Sensitive values (like DB connection strings) must not be committed. Each developer must run the setup script once per machine/profile.

For auth to work, set `JWT__Key` in `.env` (min 32 chars), then run:
`./scripts/setup-user-secrets-from-env.ps1`
