const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export type ScenarioType = 'system_error' | 'high_latency' | 'business_alert';

export interface ScenarioRun {
  id: number;
  scenario: ScenarioType;
  status: string;
  duration: number;
  createdAt: string;
}

export async function runScenario(scenario: ScenarioType): Promise<ScenarioRun> {
  const res = await fetch(`${BASE}/api/scenarios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scenario }),
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`API error ${res.status}: ${msg}`);
  }
  return res.json();
}

export async function fetchHistory(): Promise<ScenarioRun[]> {
  const res = await fetch(`${BASE}/api/scenarios`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}
