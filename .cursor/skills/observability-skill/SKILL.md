# Skill: Add Observability Scenario

Use this skill whenever you need to add a new observability scenario to Signal Lab.

## When to Use

- User says: "add a scenario for X"
- User says: "create a new signal for Y"
- Orchestrator delegates a scenario creation subtask

## Step-by-Step Instructions

### 1. Add the scenario type to the DTO enum

File: `backend/src/scenarios/dto/create-scenario.dto.ts`

```typescript
export enum ScenarioType {
  // ... existing
  MY_SCENARIO = 'my_scenario',  // add here
}
```

### 2. Handle the scenario in ScenariosService

File: `backend/src/scenarios/scenarios.service.ts`

Add a `case` in the `switch` statement and a private handler method:

```typescript
case ScenarioType.MY_SCENARIO:
  await this.handleMyScenario();
  break;

private async handleMyScenario() {
  // 1. Increment/record metric
  this.metrics.incrementScenarios('my_scenario');
  // 2. Push log
  await this.logger.info('My scenario triggered', { scenario: 'my_scenario', event: 'my_event' });
  // 3. Optionally capture Sentry exception
}
```

### 3. Add metric if new signal type is needed

File: `backend/src/metrics/metrics.service.ts`

```typescript
private readonly myScenarioTotal: Counter;
// In constructor:
this.myScenarioTotal = new Counter({
  name: 'signal_lab_my_scenario_total',
  help: 'Total my_scenario events',
  registers: [this.registry],
});
// Add public method:
incrementMyScenario() { this.myScenarioTotal.inc(); }
```

### 4. Update the frontend scenario list

File: `frontend/components/scenario-form.tsx`

Add to the `SCENARIOS` array:

```typescript
{
  value: 'my_scenario',
  label: '🔵 My Scenario',
  description: 'Description of what signals are generated',
  color: 'text-blue-400',
}
```

### 5. Add a Grafana panel (optional)

Add a new panel to `infra/grafana/provisioning/dashboards/signal-lab.json` targeting the new metric.

### 6. Update README

Add the new scenario to the "Scenarios" table in README.md.

## Validation Checklist

- [ ] DTO enum updated
- [ ] Service handler added
- [ ] Metric registered and incremented
- [ ] Log pushed (info/warn/error depending on severity)
- [ ] Frontend label added
- [ ] README updated
