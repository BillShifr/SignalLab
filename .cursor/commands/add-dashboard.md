# Command: /add-dashboard

**Usage**: `/add-dashboard <panel_title> <metric_expr>`

**Example**: `/add-dashboard "Payment Failures" "signal_lab_payment_failures_total"`

## What This Command Does

Generates a new Grafana panel JSON and appends it to the provisioned Signal Lab dashboard.

## Execution Steps

### 1. Determine panel type

- Single counter metric → `stat` panel
- Rate/trend metric → `timeseries` panel
- Loki log query → `logs` panel
- Multiple metrics comparison → `timeseries` panel

### 2. Generate panel JSON

**Stat panel template:**
```json
{
  "datasource": { "type": "prometheus", "uid": "prometheus" },
  "fieldConfig": {
    "defaults": {
      "color": { "mode": "thresholds" },
      "thresholds": { "mode": "absolute", "steps": [{ "color": "green", "value": null }] },
      "unit": "short"
    },
    "overrides": []
  },
  "gridPos": { "h": 4, "w": 6, "x": <X>, "y": <Y> },
  "id": <NEXT_ID>,
  "options": { "colorMode": "background", "graphMode": "none", "justifyMode": "center", "orientation": "auto", "reduceOptions": { "calcs": ["lastNotNull"] } },
  "title": "<panel_title>",
  "type": "stat",
  "targets": [
    { "datasource": { "type": "prometheus", "uid": "prometheus" }, "expr": "<metric_expr>", "legendFormat": "", "refId": "A" }
  ]
}
```

### 3. Append to dashboard

Read `infra/grafana/provisioning/dashboards/signal-lab.json`, find the `panels` array, insert the new panel, increment `version`.

### 4. Confirm

Tell the user:
> "Panel '<panel_title>' added. Grafana auto-reloads provisioned dashboards every 30s, or restart Grafana: `docker compose restart grafana`"
