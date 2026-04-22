# Frontend (React + TypeScript)

This frontend implements:

- register and login against `/api/auth`
- JWT token storage in localStorage
- authenticated note CRUD against `/api/notes`

## Run in development

1. Start the backend API first (HTTPS profile recommended).
2. From the repository root run:

```bash
cd frontend
npm install
npm run dev
```

Or, if your terminal is already in this folder, run:

```bash
npm install
npm run dev
```

The Vite dev server proxies `/api` and `/health` to `https://localhost:7147`.

## Pages

- `/login`: login/register only
- `/notes`: note creation and note list (protected)

If you are not authenticated, routing redirects to `/login`.

## Frontend structure (refactored)

- `src/app`: app routing and protected route
- `src/features/auth`: auth API, context, storage, hook, and types
- `src/features/notes`: notes API, hook, UI components, and types
- `src/pages`: route-level pages (`LoginPage`, `NotesPage`)
- `src/shared`: shared HTTP client and API error extraction
- `src/styles`: global app styling (retro-inspired baseline)

## Optional API base URL override

By default, requests are relative (good with Vite proxy). If you want direct calls to a different backend URL, create `.env` from `.env.example` and set:

```bash
VITE_API_BASE_URL=https://localhost:7147
```

## Build

```bash
npm run build
```
