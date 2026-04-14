#!/usr/bin/env bash
set -euo pipefail

echo '{"followup_message":"If you changed Prisma schema, run `docker compose up -d --build backend` and verify `GET /api/scenarios`."}'
