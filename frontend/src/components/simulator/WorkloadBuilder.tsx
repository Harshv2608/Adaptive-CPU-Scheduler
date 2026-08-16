import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RandomGenerator } from '@/lib/random';
import { ProcessInput, ProcessType } from '@/lib/types';
import { RefreshCw } from 'lucide-react';

interface Props {
  onGenerate: (processes: ProcessInput[]) => void;
  disabled?: boolean;
}

export const WorkloadBuilder = ({ onGenerate, disabled }: Props) => {
  const [count, setCount] = useState(10);
  const [seed, setSeed] = useState(12345);
  const [minArrival, setMinArrival] = useState(0);
  const [maxArrival, setMaxArrival] = useState(20);
  const [minBurst, setMinBurst] = useState(1);
  const [maxBurst, setMaxBurst] = useState(15);
  const [minPriority, setMinPriority] = useState(1);
  const [maxPriority, setMaxPriority] = useState(5);

  const [distBatch, setDistBatch] = useState(50);
  const [distInteractive, setDistInteractive] = useState(30);
  const [distRT, setDistRT] = useState(20);

  const handleGenerate = () => {
    const rng = new RandomGenerator(seed);
    const processes: ProcessInput[] = [];

    const totalWeight = distBatch + distInteractive + distRT;

    for (let i = 0; i < count; i++) {
      const typeRoll = rng.nextInt(0, totalWeight - 1);
      let pType: ProcessType = 'BATCH';
      if (typeRoll < distRT) {
        pType = 'REAL_TIME';
      } else if (typeRoll < distRT + distInteractive) {
        pType = 'INTERACTIVE';
      }

      processes.push({
        id: i + 1,
        arrivalTime: rng.nextInt(minArrival, maxArrival),
        burstTime: rng.nextInt(minBurst, maxBurst),
        priority: rng.nextInt(minPriority, maxPriority),
        type: pType
      });
    }

    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);
    onGenerate(processes);
  };

  return (
    <div className="bg-card border rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">Advanced Workload Generator</h3>
        <Button onClick={handleGenerate} disabled={disabled} variant="secondary">
          <RefreshCw className="w-4 h-4 mr-2" />
          Generate Workload
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="processCount">Process Count</Label>
              <Input id="processCount" aria-label="Process Count" type="number" min={1} max={500} value={count} onChange={e => setCount(parseInt(e.target.value) || 0)} disabled={disabled} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="randomSeed">Random Seed</Label>
              <Input id="randomSeed" aria-label="Random Seed" type="number" value={seed} onChange={e => setSeed(parseInt(e.target.value) || 0)} disabled={disabled} />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Min/Max Arrival Time</Label>
              <div className="flex items-center gap-2">
                <Input aria-label="Minimum Arrival Time" type="number" min={0} value={minArrival} onChange={e => setMinArrival(parseInt(e.target.value) || 0)} disabled={disabled} />
                <span>-</span>
                <Input aria-label="Maximum Arrival Time" type="number" min={0} value={maxArrival} onChange={e => setMaxArrival(parseInt(e.target.value) || 0)} disabled={disabled} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Min/Max Burst Time</Label>
              <div className="flex items-center gap-2">
                <Input aria-label="Minimum Burst Time" type="number" min={1} value={minBurst} onChange={e => setMinBurst(parseInt(e.target.value) || 1)} disabled={disabled} />
                <span>-</span>
                <Input aria-label="Maximum Burst Time" type="number" min={1} value={maxBurst} onChange={e => setMaxBurst(parseInt(e.target.value) || 1)} disabled={disabled} />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-muted-foreground mb-2">Process Class Distribution (Weights)</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="distBatch">Batch</Label>
              <Input id="distBatch" aria-label="Batch Process Weight" type="number" min={0} value={distBatch} onChange={e => setDistBatch(parseInt(e.target.value) || 0)} disabled={disabled} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="distInt">Interactive</Label>
              <Input id="distInt" aria-label="Interactive Process Weight" type="number" min={0} value={distInteractive} onChange={e => setDistInteractive(parseInt(e.target.value) || 0)} disabled={disabled} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="distRT">Real-Time</Label>
              <Input id="distRT" aria-label="Real-Time Process Weight" type="number" min={0} value={distRT} onChange={e => setDistRT(parseInt(e.target.value) || 0)} disabled={disabled} />
            </div>
          </div>
          
          <div className="space-y-2 pt-2">
              <Label>Priority Range</Label>
              <div className="flex items-center gap-2">
                <Input aria-label="Minimum Priority" type="number" min={1} value={minPriority} onChange={e => setMinPriority(parseInt(e.target.value) || 1)} disabled={disabled} />
                <span>-</span>
                <Input aria-label="Maximum Priority" type="number" min={1} value={maxPriority} onChange={e => setMaxPriority(parseInt(e.target.value) || 1)} disabled={disabled} />
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};
