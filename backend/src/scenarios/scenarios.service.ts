import { Injectable } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { PrismaService } from '../prisma/prisma.service';
import { MetricsService } from '../metrics/metrics.service';
import { LoggerService } from '../logger/logger.service';
import { CreateScenarioDto, ScenarioType } from './dto/create-scenario.dto';

@Injectable()
export class ScenariosService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly metrics: MetricsService,
    private readonly logger: LoggerService,
  ) {}

  async run(dto: CreateScenarioDto) {
    const start = Date.now();

    switch (dto.scenario) {
      case ScenarioType.SYSTEM_ERROR:
        await this.handleSystemError();
        break;
      case ScenarioType.HIGH_LATENCY:
        await this.handleHighLatency();
        break;
      case ScenarioType.BUSINESS_ALERT:
        await this.handleBusinessAlert();
        break;
    }

    const duration = Date.now() - start;
    this.metrics.incrementScenarios(dto.scenario);

    return this.prisma.scenarioRun.create({
      data: { scenario: dto.scenario, status: 'completed', duration },
    });
  }

  async findAll() {
    return this.prisma.scenarioRun.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
  }

  private async handleSystemError() {
    this.metrics.incrementErrors('system_error');

    await this.logger.error('System error triggered', {
      scenario: 'system_error',
      error: 'Signal Lab system_error scenario',
    });

    const err = new Error('Signal Lab: system_error scenario triggered');
    Sentry.captureException(err);
  }

  private async handleHighLatency() {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const duration = 500;
    this.metrics.recordLatency(duration / 1000);

    await this.logger.warn('High latency detected', {
      scenario: 'high_latency',
      duration_ms: duration,
    });
  }

  private async handleBusinessAlert() {
    this.metrics.incrementBusinessEvents('business_alert');

    await this.logger.info('Business alert triggered', {
      scenario: 'business_alert',
      event: 'business_alert',
    });
  }
}
