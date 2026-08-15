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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-1">Simulator</h1>
            <p className="text-muted-foreground">Build a workload and run the CPU scheduling simulation.</p>
          </div>
          <WorkloadPresets onLoadPreset={setProcesses} disabled={isSimulating} />
        </div>
        
        {error && (
          <div className="bg-destructive/10 text-destructive border border-destructive/20 rounded-md p-4 mb-6 flex items-center gap-3 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-alert-circle"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
            <div>
              <span className="font-semibold block">Simulation failed</span>
              <span className="text-sm opacity-90">{error}</span>
            </div>
          </div>
        )}

        <div className={`space-y-6 ${result ? "hidden" : "pb-8"}`}>
          <SimulationConfigPanel config={config} setConfig={setConfig} disabled={isSimulating} />
          
          <WorkloadBuilder onGenerate={setProcesses} disabled={isSimulating} />
          
          <ProcessTable processes={processes} setProcesses={setProcesses} disabled={isSimulating} />
        </div>
        
        {result && (
          <div className="mt-8 pb-8 border-t pt-8">
            <h2 className="text-2xl font-bold mb-6">Simulation Results</h2>
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
