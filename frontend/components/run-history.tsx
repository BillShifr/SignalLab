'use client';

import { useQuery } from '@tanstack/react-query';
import { Clock, RefreshCw } from 'lucide-react';
import { fetchHistory, type ScenarioRun } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const SCENARIO_BADGE: Record<string, 'error' | 'warn' | 'success'> = {
  system_error: 'error',
  high_latency: 'warn',
  business_alert: 'success',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export function RunHistory() {
  const { data, isLoading, isFetching, error } = useQuery<ScenarioRun[]>({
    queryKey: ['history'],
    queryFn: fetchHistory,
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Runs</CardTitle>
            <CardDescription>Last 10 scenario executions · auto-refreshes every 5s</CardDescription>
          </div>
          {isFetching && <RefreshCw className="w-4 h-4 text-slate-500 animate-spin" />}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-10 rounded-md bg-slate-800 animate-pulse" />
            ))}
          </div>
        )}

        {error && (
          <p className="text-sm text-red-400">
            Failed to load history — is the backend running?
          </p>
        )}

        {data && data.length === 0 && (
          <p className="text-sm text-slate-500 text-center py-8">
            No runs yet. Fire your first scenario →
          </p>
        )}

        {data && data.length > 0 && (
          <div className="space-y-2">
            {data.map((run) => (
              <div
                key={run.id}
                className="flex items-center justify-between rounded-lg bg-slate-800/50 border border-slate-700/50 px-3 py-2"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 w-6 text-right">#{run.id}</span>
                  <Badge variant={SCENARIO_BADGE[run.scenario] ?? 'default'}>
                    {run.scenario}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {run.duration}ms
                  </span>
                  <span>{formatDate(run.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
