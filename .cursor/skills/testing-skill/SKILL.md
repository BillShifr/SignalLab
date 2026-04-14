# Skill: Testing Signal Lab

Use this skill when writing or running tests for Signal Lab.

## Backend (NestJS) Testing

### Unit test for a service

```typescript
// backend/src/scenarios/scenarios.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ScenariosService } from './scenarios.service';
import { PrismaService } from '../prisma/prisma.service';
import { MetricsService } from '../metrics/metrics.service';
import { LoggerService } from '../logger/logger.service';

describe('ScenariosService', () => {
  let service: ScenariosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScenariosService,
        { provide: PrismaService, useValue: { scenarioRun: { create: jest.fn(), findMany: jest.fn() } } },
        { provide: MetricsService, useValue: { incrementErrors: jest.fn(), incrementBusinessEvents: jest.fn(), incrementScenarios: jest.fn(), recordLatency: jest.fn() } },
        { provide: LoggerService, useValue: { info: jest.fn(), warn: jest.fn(), error: jest.fn() } },
      ],
    }).compile();
    service = module.get<ScenariosService>(ScenariosService);
  });

  it('should run system_error scenario', async () => {
    jest.spyOn(service['prisma'].scenarioRun, 'create').mockResolvedValue({ id: 1, scenario: 'system_error', status: 'completed', duration: 10, createdAt: new Date() });
    const result = await service.run({ scenario: 'system_error' as any });
    expect(result.scenario).toBe('system_error');
  });
});
```

### Run backend tests

```bash
cd backend && npm run test
cd backend && npm run test:cov
```

## Frontend (Next.js) Testing

### Component test with React Testing Library

```typescript
// frontend/components/__tests__/scenario-form.test.tsx
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ScenarioForm } from '../scenario-form';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider>
);

describe('ScenarioForm', () => {
  it('renders the form', () => {
    render(<ScenarioForm />, { wrapper });
    expect(screen.getByText('Run Scenario')).toBeInTheDocument();
  });
});
```

## Integration Testing (Observability)

After `docker compose up -d`, verify signals:

```bash
# 1. Run a scenario
curl -X POST http://localhost:3001/api/scenarios \
  -H 'Content-Type: application/json' \
  -d '{"scenario":"system_error"}'

# 2. Check Prometheus metric
curl -s http://localhost:3001/metrics | grep signal_lab_errors_total

# 3. Check Loki logs
curl -s "http://localhost:3100/loki/api/v1/query_range?query=%7Bservice%3D%22signal-lab%22%7D&limit=5"
```
