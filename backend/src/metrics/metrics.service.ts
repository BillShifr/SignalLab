import { Injectable } from '@nestjs/common';
import {
  Registry,
  Counter,
  Histogram,
  collectDefaultMetrics,
} from 'prom-client';

@Injectable()
export class MetricsService {
  readonly registry: Registry;

  private readonly errorsTotal: Counter;
  private readonly businessEventsTotal: Counter;
  private readonly scenariosTotal: Counter;
  private readonly requestDuration: Histogram;

  constructor() {
    this.registry = new Registry();

    collectDefaultMetrics({ register: this.registry, prefix: 'signal_lab_node_' });

    this.errorsTotal = new Counter({
      name: 'signal_lab_errors_total',
      help: 'Total number of system errors triggered',
      labelNames: ['scenario'],
      registers: [this.registry],
    });

    this.businessEventsTotal = new Counter({
      name: 'signal_lab_business_events_total',
      help: 'Total number of business events triggered',
      labelNames: ['event'],
      registers: [this.registry],
    });

    this.scenariosTotal = new Counter({
      name: 'signal_lab_scenarios_total',
      help: 'Total scenarios executed',
      labelNames: ['scenario', 'status'],
      registers: [this.registry],
    });

    this.requestDuration = new Histogram({
      name: 'signal_lab_request_duration_seconds',
      help: 'Request duration in seconds for high_latency scenario',
      buckets: [0.1, 0.25, 0.5, 1, 2.5, 5],
      registers: [this.registry],
    });
  }

  incrementErrors(scenario = 'system_error') {
    this.errorsTotal.inc({ scenario });
  }

  incrementBusinessEvents(event = 'business_alert') {
    this.businessEventsTotal.inc({ event });
  }

  incrementScenarios(scenario: string, status = 'completed') {
    this.scenariosTotal.inc({ scenario, status });
  }

  recordLatency(durationSeconds: number) {
    this.requestDuration.observe(durationSeconds);
  }

  async getMetrics(): Promise<string> {
    return this.registry.metrics();
  }

  getContentType(): string {
    return this.registry.contentType;
  }
}
