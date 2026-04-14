'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertCircle, CheckCircle, Loader2, Play } from 'lucide-react';
import { runScenario, type ScenarioType } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FormValues {
  scenario: ScenarioType;
}

const SCENARIOS: { value: ScenarioType; label: string; description: string; color: string }[] = [
  {
    value: 'system_error',
    label: '🔴 System Error',
    description: 'Throws exception → Sentry + errors_total metric + error log',
    color: 'text-red-400',
  },
  {
    value: 'high_latency',
    label: '🟡 High Latency',
    description: '500ms artificial delay → request_duration_seconds metric + warn log',
    color: 'text-yellow-400',
  },
  {
    value: 'business_alert',
    label: '🟢 Business Alert',
    description: 'Business event → business_events_total metric + info log',
    color: 'text-green-400',
  },
];

export function ScenarioForm() {
  const queryClient = useQueryClient();
  const [lastResult, setLastResult] = useState<{ ok: boolean; msg: string } | null>(null);

  const { control, handleSubmit, watch } = useForm<FormValues>({
    defaultValues: { scenario: 'system_error' },
  });

  const selectedScenario = watch('scenario');
  const scenarioMeta = SCENARIOS.find((s) => s.value === selectedScenario);

  const mutation = useMutation({
    mutationFn: (data: FormValues) => runScenario(data.scenario),
    onSuccess: (run) => {
      setLastResult({ ok: true, msg: `Run #${run.id} completed in ${run.duration}ms` });
      queryClient.invalidateQueries({ queryKey: ['history'] });
    },
    onError: (err: Error) => {
      setLastResult({ ok: false, msg: err.message });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Run Scenario</CardTitle>
        <CardDescription>Select a scenario and fire a signal into the observability stack.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="scenario-select">Scenario</Label>
            <Controller
              name="scenario"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="scenario-select">
                    <SelectValue placeholder="Select scenario" />
                  </SelectTrigger>
                  <SelectContent>
                    {SCENARIOS.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {scenarioMeta && (
            <div className="rounded-lg bg-slate-800/60 border border-slate-700 p-3">
              <p className={`text-sm font-medium ${scenarioMeta.color}`}>{scenarioMeta.label}</p>
              <p className="text-xs text-slate-400 mt-1">{scenarioMeta.description}</p>
            </div>
          )}

          <Button type="submit" disabled={mutation.isPending} className="w-full">
            {mutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Running…
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Run Scenario
              </>
            )}
          </Button>
        </form>

        {lastResult && (
          <div
            className={`mt-4 flex items-center gap-2 rounded-lg p-3 text-sm ${
              lastResult.ok
                ? 'bg-green-900/30 border border-green-800 text-green-300'
                : 'bg-red-900/30 border border-red-800 text-red-300'
            }`}
          >
            {lastResult.ok ? (
              <CheckCircle className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            {lastResult.msg}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
