# Command: /check-obs

**Usage**: `/check-obs`

## What This Command Does

Checks the availability and health of all observability services in the Signal Lab stack.

## Execution Steps

Run the following checks and report results:

### 1. Backend

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/scenarios
# Expected: 200
```

### 2. Prometheus Metrics Endpoint

```bash
curl -s http://localhost:3001/metrics | grep signal_lab_scenarios_total
# Expected: metric line with value
```

### 3. Prometheus UI

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:9090/-/healthy
# Expected: 200
```

### 4. Loki

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3100/ready
# Expected: 200 with body "ready"
```

### 5. Grafana

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3002/api/health
# Expected: 200
```

### 6. Sentry (connection check)

If `SENTRY_DSN` is set in `.env`, verify the DSN is reachable:
```bash
echo $SENTRY_DSN | grep -q "sentry.io" && echo "DSN configured" || echo "SENTRY_DSN not set"
```

## Report Format

```
✅ Backend         http://localhost:3001   (200)
✅ Prometheus      http://localhost:9090   (healthy)
✅ Loki            http://localhost:3100   (ready)
✅ Grafana         http://localhost:3002   (200)
⚠️  Sentry         SENTRY_DSN not set in .env
```

For any failures, suggest the fix:
- Service not responding → `docker compose ps` to check container status
- Wrong HTTP code → `docker compose logs <service>` to inspect errors
