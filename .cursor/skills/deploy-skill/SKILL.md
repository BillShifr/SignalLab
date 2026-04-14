# Skill: Deploy Signal Lab

Use this skill when deploying, restarting, or updating Signal Lab services.

## Local Development (Docker Compose)

```bash
# Start everything
docker compose up -d

# View logs
docker compose logs -f backend
docker compose logs -f frontend

# Restart a single service after code change
docker compose up -d --build backend

# Stop everything
docker compose down

# Stop and remove volumes (DESTRUCTIVE)
docker compose down -v
```

## Service URLs

| Service | URL | Credentials |
|---|---|---|
| Frontend | http://localhost:3000 | – |
| Backend API | http://localhost:3001/api | – |
| Prometheus metrics | http://localhost:3001/metrics | – |
| Prometheus UI | http://localhost:9090 | – |
| Grafana | http://localhost:3002 | admin / admin |
| Loki | http://localhost:3100/ready | – |

## Updating Backend Code

1. Edit `backend/src/**`
2. `docker compose up -d --build backend`
3. Verify: `docker compose logs backend`

## Updating Frontend Code

1. Edit `frontend/**`
2. `docker compose up -d --build frontend`
3. Verify: `docker compose logs frontend`

## Adding a New Environment Variable

1. Add to `.env` (local dev, not committed)
2. Add to `.env.example` with placeholder value
3. Add to `docker-compose.yml` in the relevant service's `environment` block
4. Document in README

## Database Operations

```bash
# Connect to the database
docker compose exec postgres psql -U postgres -d signallab

# Run a migration manually
docker compose exec backend npx prisma migrate deploy

# View Prisma Studio (requires local node_modules)
cd backend && npx prisma studio
```

## Health Checks

```bash
# All services healthy?
docker compose ps

# Backend health
curl http://localhost:3001/api/scenarios

# Prometheus targets
curl http://localhost:9090/api/v1/targets
```
