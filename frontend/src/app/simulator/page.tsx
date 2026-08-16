"use client";

import React, { useState } from 'react';
import { PageContainer } from "@/components/layout/PageContainer";
import { SimulationConfigPanel } from "@/components/simulator/SimulationConfigPanel";
import { WorkloadPresets, WORKLOAD_PRESETS } from "@/components/simulator/WorkloadPresets";
import { WorkloadBuilder } from "@/components/simulator/WorkloadBuilder";
import { ProcessTable } from "@/components/simulator/ProcessTable";
import { SimulationControls } from "@/components/simulator/SimulationControls";
import { SimulationPlayback } from "@/components/visualization/SimulationPlayback";
import { ProcessInput, SimulationConfig, SimulationResult } from "@/lib/types";
import { api } from "@/lib/api";

export default function SimulatorPage() {
  const [config, setConfig] = useState<SimulationConfig>({
    algorithm: 'HYBRID',
    agingThreshold: 10,
    timeQuantum: 2,
    totalTime: 500
  });

  const [processes, setProcesses] = useState<ProcessInput[]>(
    JSON.parse(JSON.stringify(WORKLOAD_PRESETS.balanced))
  );

  React.useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const stateParam = urlParams.get('state');
      if (stateParam) {
        const decoded = JSON.parse(atob(stateParam));
        if (decoded.config) setConfig(decoded.config);
        if (decoded.processes) setProcesses(decoded.processes);
      }
    } catch (err) {
      console.error("Failed to parse state from URL", err);
    }
  }, []);

  const handleShare = () => {
    try {
      const encoded = btoa(JSON.stringify({ config, processes }));
      const url = new URL(window.location.href);
      url.searchParams.set('state', encoded);
      window.history.replaceState({}, '', url.toString());
      navigator.clipboard.writeText(url.toString());
      alert("Simulation URL copied to clipboard!");
    } catch (err) {
      console.error("Failed to encode state", err);
    }
  };

  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = (): string | null => {
    if (processes.length === 0) return "Please add at least one process.";
    if (processes.length > 500) return "Maximum 500 processes allowed.";
    for (const p of processes) {
      if (p.burstTime <= 0) return `Process P${p.id} must have Burst Time > 0.`;
      if (p.arrivalTime < 0) return `Process P${p.id} cannot have negative Arrival Time.`;
      if (p.priority < 0) return `Process P${p.id} cannot have negative Priority.`;
    }
    return null;
  };

  const handleRun = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setIsSimulating(true);
    setResult(null);

    try {
      const simResult = await api.simulate(processes, config);
      setResult(simResult);
    } catch (err: any) {
      setError(err.message || "Unable to execute scheduler engine. Try again.");
    } finally {
      setIsSimulating(false);
    }
  };

  const handleReset = () => {
    setProcesses(JSON.parse(JSON.stringify(WORKLOAD_PRESETS.balanced)));
    setResult(null);
    setError(null);
  };

  return (
    <div className="flex flex-col h-full">
      <PageContainer>
        <div className={`flex flex-col h-full ${result ? "pb-0" : ""}`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-1">Interactive Simulator</h1>
              <p className="text-muted-foreground">Configure the scheduler, build a workload, and analyze the results.</p>
            </div>
            <WorkloadPresets onLoadPreset={setProcesses} disabled={isSimulating} />
          </div>
          
          {error && (
            <div className="bg-destructive/10 text-destructive border border-destructive/30 rounded-lg p-6 mb-8 flex items-start gap-4 shadow-sm animate-in fade-in">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-alert-triangle mt-1 shrink-0"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
              <div>
                <h3 className="font-bold text-lg mb-1">Simulation Engine Error</h3>
                <p className="text-sm opacity-90 leading-relaxed">
                  {error.includes("fetch") 
                    ? "Unable to reach the Express backend API. Please ensure the server is running on port 3001."
                    : error}
                </p>
                {error.includes("fetch") && (
                  <div className="mt-4 p-3 bg-background/50 rounded text-xs font-mono border border-destructive/20">
                    $ npm run start:backend
                  </div>
                )}
              </div>
            </div>
          )}

          <div className={`space-y-12 ${result ? "hidden" : "pb-12"}`}>
            {/* Step 1 */}
            <section className="space-y-4 relative">
              <div className="flex items-center gap-3 border-b pb-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">1</span>
                <h2 className="text-xl font-semibold tracking-tight">Configure Scheduler</h2>
              </div>
              <SimulationConfigPanel config={config} setConfig={setConfig} disabled={isSimulating} />
            </section>
            
            {/* Step 2 */}
            <section className="space-y-4">
              <div className="flex items-center gap-3 border-b pb-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">2</span>
                <h2 className="text-xl font-semibold tracking-tight">Generate Workload</h2>
              </div>
              <WorkloadBuilder onGenerate={setProcesses} disabled={isSimulating} />
            </section>
            
            {/* Step 3 */}
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">3</span>
                  <h2 className="text-xl font-semibold tracking-tight">Review Process Queue</h2>
                </div>
                <span className="text-sm font-medium text-muted-foreground">{processes.length} / 500 Processes</span>
              </div>
              
              {processes.length === 0 ? (
                <div className="border-2 border-dashed rounded-xl p-12 text-center flex flex-col items-center justify-center bg-muted/20">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-inbox text-muted-foreground/50 mb-4"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>
                  <h3 className="font-semibold text-lg mb-1">Queue is Empty</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">Use the Workload Generator above or manually add processes to start a simulation.</p>
                </div>
              ) : (
                <ProcessTable processes={processes} setProcesses={setProcesses} disabled={isSimulating} />
              )}
            </section>
          </div>
          
          {result && (
            <div className="mt-8 pb-12 pt-4">
              <div className="flex items-center gap-3 border-b pb-2 mb-8">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">4</span>
                <h2 className="text-2xl font-bold tracking-tight">Simulation Analysis</h2>
              </div>
              <SimulationPlayback result={result} processes={processes} />
            </div>
          )}
        </div>
      </PageContainer>
      
      {!result && (
        <SimulationControls 
          onRun={handleRun} 
          onReset={handleReset} 
          onShare={handleShare}
          isSimulating={isSimulating} 
        />
      )}
    </div>
  );
}
