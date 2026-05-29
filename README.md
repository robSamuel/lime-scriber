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

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `OPENAI_API_KEY` | For audio | OpenAI API key for Whisper transcription; audio requests return `503` if unset |
| `PORT` | No | API port (default `3001`) |
| `CORS_ORIGIN` | No | Allowed browser origin (default `http://localhost:5173`) |
| `VITE_API_URL` | No | API base URL for the web app |

Audio uploads are stored under `apps/api/uploads/` (Docker uses a named volume `uploads_data`).

### Create an audio note

```bash
curl -X POST http://localhost:3001/notes \
  -F "patientId=<patient-id>" \
  -F "inputType=AUDIO" \
  -F "audio=@/path/to/recording.mp3"
```

## Assumptions

- Audio files are stored locally under `uploads/` (S3 is optional future work).
- SOAP structuring (`processedContent`) is implemented in a follow-up PR.

## Next steps

- [ ] SOAP structuring via GPT (PR-3)
- [ ] Note list, detail, and create-note UI (PR-4)
- [ ] README polish and video walkthrough (PR-5)
