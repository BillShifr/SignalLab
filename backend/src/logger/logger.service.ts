import { Injectable } from '@nestjs/common';
import axios from 'axios';

interface LogEntry {
  level: string;
  message: string;
  fields?: Record<string, unknown>;
}

@Injectable()
export class LoggerService {
  private readonly lokiUrl = process.env.LOKI_URL ?? 'http://localhost:3100';

  private async push(entry: LogEntry): Promise<void> {
    const nsTimestamp = `${Date.now() * 1_000_000}`;
    const line = JSON.stringify({ ...entry.fields, level: entry.level, msg: entry.message });

    try {
      await axios.post(
        `${this.lokiUrl}/loki/api/v1/push`,
        {
          streams: [
            {
              stream: {
                service: 'signal-lab',
                level: entry.level,
                scenario: (entry.fields?.scenario as string) ?? 'unknown',
              },
              values: [[nsTimestamp, line]],
            },
          ],
        },
        { headers: { 'Content-Type': 'application/json' }, timeout: 3000 },
      );
    } catch {
      // Loki push failure is non-fatal – log to stdout only
      console.error('[LoggerService] Failed to push to Loki');
    }

    const prefix = `[${entry.level.toUpperCase()}]`;
    if (entry.level === 'error') console.error(prefix, line);
    else if (entry.level === 'warn') console.warn(prefix, line);
    else console.log(prefix, line);
  }

  async info(message: string, fields?: Record<string, unknown>) {
    return this.push({ level: 'info', message, fields });
  }

  async warn(message: string, fields?: Record<string, unknown>) {
    return this.push({ level: 'warn', message, fields });
  }

  async error(message: string, fields?: Record<string, unknown>) {
    return this.push({ level: 'error', message, fields });
  }
}
