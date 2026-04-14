import { ScenarioForm } from '@/components/scenario-form';
import { RunHistory } from '@/components/run-history';
import { Activity, BarChart3, ExternalLink, Layers } from 'lucide-react';

const LINKS = [
  { label: 'Grafana', href: 'http://localhost:3000/grafana', color: 'text-orange-400' },
  { label: 'Prometheus', href: 'http://localhost:9090', color: 'text-red-400' },
  { label: 'Loki', href: 'http://localhost:3100/ready', color: 'text-yellow-400' },
  { label: 'Backend /metrics', href: 'http://localhost:3001/metrics', color: 'text-green-400' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0d1117]">
      {/* Header */}
      <header className="border-b border-slate-800 bg-[#0d1117]/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-semibold text-white">Signal Lab</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-900/50 text-blue-300 border border-blue-800">
              Observability Playground
            </span>
          </div>
          <nav className="flex items-center gap-4">
            {LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-1 text-sm ${l.color} hover:opacity-80 transition-opacity`}
              >
                {l.label}
                <ExternalLink className="w-3 h-3" />
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        {/* Hero */}
        <div className="text-center space-y-3 py-4">
          <h1 className="text-4xl font-bold text-white">
            Generate <span className="text-blue-400">Observability Signals</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Trigger scenarios to produce metrics in Prometheus, logs in Loki, and errors in Sentry — all in one click.
          </p>
        </div>

        {/* Signal overview */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: BarChart3, label: 'Prometheus Metrics', desc: 'errors_total · request_duration · business_events', color: 'text-red-400 bg-red-900/20 border-red-800/50' },
            { icon: Layers, label: 'Loki Logs', desc: 'Structured JSON logs pushed on every scenario run', color: 'text-yellow-400 bg-yellow-900/20 border-yellow-800/50' },
            { icon: Activity, label: 'Sentry Errors', desc: 'Exceptions captured for system_error scenarios', color: 'text-purple-400 bg-purple-900/20 border-purple-800/50' },
          ].map(({ icon: Icon, label, desc, color }) => (
            <div key={label} className={`rounded-xl border p-4 ${color}`}>
              <Icon className="w-5 h-5 mb-2" />
              <p className="font-medium text-white text-sm">{label}</p>
              <p className="text-xs mt-1 opacity-70">{desc}</p>
            </div>
          ))}
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ScenarioForm />
          <RunHistory />
        </div>
      </main>
    </div>
  );
}
