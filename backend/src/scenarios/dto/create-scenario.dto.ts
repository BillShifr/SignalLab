import { IsEnum } from 'class-validator';

export enum ScenarioType {
  SYSTEM_ERROR = 'system_error',
  HIGH_LATENCY = 'high_latency',
  BUSINESS_ALERT = 'business_alert',
}

export class CreateScenarioDto {
  @IsEnum(ScenarioType, {
    message: 'scenario must be one of: system_error, high_latency, business_alert',
  })
  scenario: ScenarioType;
}
