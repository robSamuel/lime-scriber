# lime-scriber

AI Scribe Notes Management Tool (Lime takehome) — project scaffold.

## Prerequisites

- Docker and Docker Compose
- Node.js 22 (optional, for local development without Docker)

## Quick start (Docker)

```bash
cp .env.example .env
docker compose up --build
```

- Web: http://localhost:5173
- API health: http://localhost:3001/health
- API patients: http://localhost:3001/patients

The browser runs on your host, so `VITE_API_URL` must point to `http://localhost:3001` (the mapped API port), not the internal Docker hostname `api`.

PostgreSQL is only reachable inside the Docker network (port 5432 is not published to the host, to avoid conflicts with a local Postgres instance). The API connects via the hostname `postgres`.

## Local development (without Docker)

1. Start PostgreSQL and set `DATABASE_URL` in `.env` (use `localhost` instead of `postgres`).
2. Install dependencies: `npm install`
3. Migrate and seed: `npm run db:migrate && npm run db:seed`
4. Run API and web: `npm run dev`

## Workspace scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Run API and web concurrently |
| `npm run docker:up` | Build and start all Docker services |
| `npm run docker:down` | Stop Docker services |
| `npm run db:migrate` | Run Prisma migrations (API workspace) |
| `npm run db:seed` | Seed mock patients (API workspace) |

## Assumptions

- Scaffold only: health check, patient list, and web smoke-test page.
- OpenAI transcription/summarization and S3 storage are deferred to the next phase.

## Next steps

- [ ] `POST /notes` with text and audio upload (multer)
- [ ] OpenAI Whisper + clinical note structuring
- [ ] Note list and detail UI
- [ ] Optional AWS S3 for audio files
