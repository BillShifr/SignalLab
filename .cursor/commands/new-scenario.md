# Command: /new-scenario

**Usage**: `/new-scenario <scenario_name>`

**Example**: `/new-scenario payment_failure`

## What This Command Does

Creates all boilerplate files and code changes needed to add a new observability scenario to Signal Lab.

## Execution Steps

When this command is invoked with `<scenario_name>`:

1. **Validate** the name: must be `snake_case`, no spaces, no special chars

2. **Read** `backend/src/scenarios/dto/create-scenario.dto.ts` and add:
   ```typescript
   <SCENARIO_NAME_UPPER> = '<scenario_name>',
   ```

3. **Read** `backend/src/scenarios/scenarios.service.ts` and add:
   ```typescript
   case ScenarioType.<SCENARIO_NAME_UPPER>:
     await this.handle<ScenarioNamePascal>();
     break;
   ```
   And the private handler:
   ```typescript
   private async handle<ScenarioNamePascal>() {
     this.metrics.incrementScenarios('<scenario_name>');
     await this.logger.info('<ScenarioNamePascal> triggered', { scenario: '<scenario_name>' });
   }
   ```

4. **Read** `frontend/components/scenario-form.tsx` and add to `SCENARIOS`:
   ```typescript
   {
     value: '<scenario_name>',
     label: '🔵 <Scenario Name>',
     description: 'Describe what signals this generates',
     color: 'text-blue-400',
   }
   ```

5. **Report** what was changed and instruct the user to:
   - Rebuild backend: `docker compose up -d --build backend`
   - Verify metric: `curl http://localhost:3001/metrics | grep signal_lab_scenarios`
