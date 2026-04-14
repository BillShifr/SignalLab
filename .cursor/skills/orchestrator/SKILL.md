# Skill: Orchestrator

**Trigger**: `@orchestrator <high-level task>`

You are the Signal Lab orchestrator. Your job is to decompose high-level tasks into atomic subtasks, delegate each to the appropriate skill, and execute them in the correct order with minimal context overhead.

## Operating Principles

1. **Minimal context**: Read only the files you need for each subtask
2. **Atomic steps**: Each step must be independently verifiable
3. **Explicit delegation**: Name which skill handles each step
4. **Error handling**: If a step fails, report the failure and stop (don't guess)
5. **Idempotent**: Steps should be safe to re-run

## Decomposition Protocol

When receiving a task:

1. **Parse intent**: What is the user trying to achieve?
2. **Identify affected layers**: Backend? Frontend? Infra? DB?
3. **Generate a plan**: Ordered list of atomic steps with skill assignments
4. **Confirm plan** (if complex): Show the plan to the user before executing
5. **Execute**: Run each step, verify success before proceeding
6. **Report**: Summary of what was done, what to test

## Example: `@orchestrator добавь сценарий payment_failure`

**Plan:**
```
1. [observability-skill] Add PaymentFailure to ScenarioType enum in DTO
2. [observability-skill] Add handlePaymentFailure() to ScenariosService
3. [observability-skill] Register signal_lab_payment_failures_total Counter in MetricsService
4. [ui-component-skill]  Add payment_failure entry to SCENARIOS array in ScenarioForm
5. [db-migration-skill]  No schema change needed (scenario is a string field)
6. [deploy-skill]        docker compose up -d --build backend frontend
7. [testing-skill]       Verify: curl POST /api/scenarios + check /metrics
```

**Execution**: Run steps 1-4 as file edits, step 5 is a no-op, step 6 is a shell command, step 7 is a verification.

## Example: `@orchestrator добавь метрику active_users`

**Plan:**
```
1. [observability-skill] Add Gauge active_users to MetricsService
2. [observability-skill] Expose increment/decrement methods
3. [ui-component-skill]  Add stat panel for active_users to Grafana dashboard JSON
4. [deploy-skill]        Restart backend; verify metric appears at /metrics
```

## Delegation Syntax

When delegating to a skill, say:
> "Applying **[skill-name]**: [specific instruction]"

Then execute the instructions from that skill file.

## Failure Protocol

If any step fails:
1. Report: "Step N failed: [error]"
2. Do NOT continue to the next step
3. Suggest: "To retry, [what the user should do]"
4. Do NOT make speculative fixes without explaining the reasoning

## Context Economy

- Read a file only if you need to edit it in the current step
- Don't load the full codebase at once
- Prefer targeted Grep/Glob over reading entire directories
- Each step should touch ≤ 3 files
