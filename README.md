# Signal Lab – Татьянкин

## Старт

```bash
git clone <repo-url> signal-lab
cd signal-lab
cp .env.example .env          # cdn предоставлю либо свой 
docker compose up -d
```

крутится  **http://localhost:3000** 

---

## Архитектура

```
┌─────────────────────────────────────────────────────┐
│                    Docker Network                    │
│                                                      │
│  ┌──────────┐   POST /api/scenarios   ┌──────────┐  │
│  │  Next.js │ ──────────────────────▶ │  NestJS  │  │
│  │  :3000   │ ◀──────────────────────  │  :3001   │  │
│  └──────────┘   JSON response         └────┬─────┘  │
│                                            │        │
│                          ┌─────────────────┼──────┐ │
│                          ▼         ▼       ▼      │ │
│                     ┌────────┐ ┌──────┐ ┌──────┐  │ │
│                     │Postgres│ │ Loki │ │Sentry│  │ │
│                     │ :5432  │ │:3100 │ │cloud │  │ │
│                     └────────┘ └──────┘ └──────┘  │ │
│                                                    │ │
│  ┌──────────┐  scrape /metrics  ┌────────────────┐ │ │
│  │Prometheus│ ◀────────────────  │  NestJS /metrics│ │ │
│  │  :9090   │                   └────────────────┘ │ │
│  └────┬─────┘                                      │ │
│       │                                            │ │
│  ┌────▼─────┐  datasource                         │ │
│  │ Grafana  │ ─────────────────────────────────── ┘ │
│  │ :3002 and proxied via :3000/grafana              │
│  └──────────┘                                        │
└─────────────────────────────────────────────────────┘
```

---

## Структура

```
signal-lab/
├── backend/                    # NestJS REST API
│   ├── src/
│   │   ├── instrument.ts       # Sentry initialization (loaded first)
│   │   ├── main.ts             # Bootstrap: CORS, ValidationPipe, listen :3001
│   │   ├── app.module.ts       # Root module
│   │   ├── prisma/             # PrismaService (global module)
│   │   ├── metrics/            # prom-client counters + /metrics endpoint
│   │   ├── logger/             # Structured logging → Loki push API
│   │   └── scenarios/          # ScenarioController + ScenarioService
│   │       └── dto/            # CreateScenarioDto with @IsEnum validation
│   ├── prisma/
│   │   └── schema.prisma       # ScenarioRun model
│   ├── entrypoint.sh           # Runs prisma migrate deploy then node dist/main
│   └── Dockerfile              # Multi-stage: builder + runner
│
├── frontend/                   # Next.js 14 App Router
│   ├── app/
│   │   ├── layout.tsx          # Root layout + QueryClientProvider
│   │   ├── page.tsx            # Main page: form + history + links
│   │   └── globals.css         # Tailwind + CSS variables (dark theme)
│   ├── components/
│   │   ├── providers.tsx       # TanStack Query client provider
│   │   ├── scenario-form.tsx   # React Hook Form + shadcn Select
│   │   ├── run-history.tsx     # TanStack Query auto-refresh table
│   │   └── ui/                 # shadcn components (Button, Card, Badge, ...)
│   └── lib/
│       ├── api.ts              # runScenario(), fetchHistory()
│       └── utils.ts            # cn() utility
│
├── infra/
│   ├── prometheus/
│   │   └── prometheus.yml      # Scrapes backend:3001/metrics every 10s
│   ├── loki/
│   │   └── loki-config.yaml    # Single-binary Loki with filesystem storage
│   └── grafana/
│       └── provisioning/
│           ├── datasources/    # Prometheus + Loki auto-provisioned
│           └── dashboards/     # signal-lab.json auto-provisioned
│
├── .cursor/                    # AI layer for Cursor
│   ├── rules/                  # Persistent coding guidelines
│   ├── skills/                 # Reusable AI playbooks
│   ├── commands/               # Slash commands
│   └── hooks/                  # pre/post-commit scripts
│
├── docker-compose.yml          # All 6 services, healthchecks, volumes
├── .env.example                # Template – copy to .env
└── README.md
```

