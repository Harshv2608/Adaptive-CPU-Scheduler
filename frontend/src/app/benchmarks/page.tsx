'use client';

import React, { useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { Loader2, Play, Trash2 } from 'lucide-react';
import { ProcessInput, SimulationConfig, ComparisonResult, ProcessType, AlgorithmType } from '@/lib/types';
import { api } from '@/lib/api';

import { ProcessTable } from '@/components/simulator/ProcessTable';
import { MetricsComparisonCharts } from '@/components/analytics/MetricsComparisonCharts';
import { HybridInsightsPanel } from '@/components/analytics/HybridInsightsPanel';

const WORKLOAD_PRESETS = [
  { id: 'mixed', label: 'Mixed Workload' },
  { id: 'cpu', label: 'CPU Heavy (Batch)' },
  { id: 'interactive', label: 'Interactive Heavy' },
  { id: 'realtime', label: 'Real-Time Heavy' },
  { id: 'starvation', label: 'Starvation (Batch vs RT)' },
  { id: 'preemption', label: 'Preemption (RT interrupts Batch)' },
  { id: 'random', label: 'Random (20 Processes)' }
];

const generateRandomProcesses = (count: number): ProcessInput[] => {
  const types: ProcessType[] = ['REAL_TIME', 'INTERACTIVE', 'BATCH'];
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    arrivalTime: Math.floor(Math.random() * 20),
    burstTime: Math.floor(Math.random() * 15) + 1,
    priority: Math.floor(Math.random() * 5) + 1,
    type: types[Math.floor(Math.random() * types.length)]
  })).sort((a, b) => a.arrivalTime - b.arrivalTime);
};

export default function BenchmarksPage() {
  const [processes, setProcesses] = useState<ProcessInput[]>([]);
  const [config, setConfig] = useState<SimulationConfig>({ 
    algorithm: 'HYBRID', 
    agingThreshold: 10, 
    timeQuantum: 4, 
    totalTime: 500 
  });
  const [isComparing, setIsComparing] = useState(false);
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const applyPreset = (presetId: string) => {
    let newProcs: ProcessInput[] = [];
    switch (presetId) {
      case 'mixed':
        newProcs = [
          { id: 1, arrivalTime: 0, burstTime: 8, priority: 1, type: 'INTERACTIVE' },
          { id: 2, arrivalTime: 1, burstTime: 4, priority: 2, type: 'REAL_TIME' },
          { id: 3, arrivalTime: 2, burstTime: 9, priority: 3, type: 'BATCH' },
          { id: 4, arrivalTime: 3, burstTime: 5, priority: 2, type: 'INTERACTIVE' },
          { id: 5, arrivalTime: 4, burstTime: 2, priority: 4, type: 'BATCH' },
        ];
        break;
      case 'cpu':
        newProcs = generateRandomProcesses(10).map(p => ({ ...p, type: 'BATCH' as ProcessType }));
        break;
      case 'interactive':
        newProcs = generateRandomProcesses(10).map(p => ({ ...p, type: 'INTERACTIVE' as ProcessType, burstTime: Math.floor(Math.random() * 5) + 1 }));
        break;
      case 'realtime':
        newProcs = generateRandomProcesses(8).map(p => ({ ...p, type: 'REAL_TIME' as ProcessType }));
        break;
      case 'starvation':
        newProcs = [
          { id: 1, arrivalTime: 0, burstTime: 50, priority: 5, type: 'BATCH' },
          { id: 2, arrivalTime: 2, burstTime: 20, priority: 1, type: 'REAL_TIME' },
          { id: 3, arrivalTime: 4, burstTime: 20, priority: 1, type: 'REAL_TIME' },
          { id: 4, arrivalTime: 6, burstTime: 20, priority: 1, type: 'REAL_TIME' },
        ];
        break;
      case 'preemption':
        newProcs = [
          { id: 1, arrivalTime: 0, burstTime: 20, priority: 5, type: 'BATCH' },
          { id: 2, arrivalTime: 5, burstTime: 5, priority: 1, type: 'REAL_TIME' },
          { id: 3, arrivalTime: 12, burstTime: 5, priority: 1, type: 'REAL_TIME' }
        ];
        break;
      case 'random':
        newProcs = generateRandomProcesses(20);
        break;
    }
    setProcesses(newProcs);
    setResult(null);
  };

  const handleCompare = async () => {
    if (processes.length === 0) return;
    setIsComparing(true);
    try {
      const res = await api.compare(processes, config);
      setResult(res);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Comparison failed. Backend might be offline.");
    } finally {
      setIsComparing(false);
    }
  };

  return (
    <PageContainer>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Compare algorithm performance on the identical workload.</p>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive border border-destructive/20 rounded-md p-4 mb-6 flex items-center gap-3 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-alert-circle"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
          <div>
            <span className="font-semibold block">Benchmark failed</span>
            <span className="text-sm opacity-90">{error}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card border rounded-xl p-6">
            <h2 className="text-lg font-bold mb-4">Workload Scenarios</h2>
            <div className="flex flex-col gap-2">
              {WORKLOAD_PRESETS.map(preset => (
                <Button 
                  key={preset.id} 
                  variant="outline" 
                  className="justify-start w-full"
                  onClick={() => applyPreset(preset.id)}
                >
                  {preset.label}
                </Button>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t">
              <Button 
                onClick={handleCompare} 
                disabled={isComparing || processes.length === 0} 
                className="w-full"
                size="lg"
              >
                {isComparing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
                Run Benchmark
              </Button>
              <Button 
                variant="ghost" 
                className="w-full mt-2" 
                onClick={() => { setProcesses([]); setResult(null); }}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Clear
              </Button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {processes.length > 0 && (
            <div className="bg-card border rounded-xl p-6 overflow-hidden">
              <h2 className="text-lg font-bold mb-4">Input Workload ({processes.length} Processes)</h2>
              <div className="h-64 overflow-y-auto pr-2 custom-scrollbar">
                <ProcessTable processes={processes} setProcesses={() => {}} disabled={true} />
              </div>
            </div>
          )}
          
          {processes.length === 0 && !result && (
            <div className="h-full min-h-[300px] border rounded-xl border-dashed flex items-center justify-center text-muted-foreground">
              Select a workload preset to begin comparison
            </div>
          )}
        </div>
      </div>

      {result && (
        <div className="mt-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <HybridInsightsPanel result={result} />
          
          <MetricsComparisonCharts result={result} />

          <div className="bg-card border rounded-xl p-6">
            <h2 className="text-lg font-bold mb-6">Execution Summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {['FCFS', 'SJF', 'PRIORITY', 'ROUND_ROBIN', 'HYBRID'].map(algo => (
                <div key={algo} className="p-4 bg-muted/30 rounded-lg text-center">
                  <h4 className="text-xs font-semibold text-muted-foreground mb-1">{algo.replace('_', ' ')}</h4>
                  <div className="text-2xl font-bold">
                    {result.results[algo as AlgorithmType]?.simulation.totalTime || 0}
                    <span className="text-xs text-muted-foreground font-normal ml-1">ticks</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
