import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SimulationConfig, AlgorithmType } from '@/lib/types';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface Props {
  config: SimulationConfig;
  setConfig: (config: SimulationConfig) => void;
  disabled?: boolean;
}

export const SimulationConfigPanel = ({ config, setConfig, disabled }: Props) => {
  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-1">Simulation Configuration</h3>
        <p className="text-sm text-muted-foreground">Select the algorithm and tune its parameters.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label>Algorithm</Label>
          <Select 
            disabled={disabled}
            value={config.algorithm} 
            onValueChange={(val) => setConfig({ ...config, algorithm: val as AlgorithmType })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Algorithm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="HYBRID">⚡ Adaptive Hybrid</SelectItem>
              <SelectItem value="FCFS">First Come First Serve</SelectItem>
              <SelectItem value="SJF">Shortest Job First</SelectItem>
              <SelectItem value="PRIORITY">Priority Scheduling</SelectItem>
              <SelectItem value="ROUND_ROBIN">Round Robin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label>Aging Threshold</Label>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Wait time before a process is promoted.</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Input 
            disabled={disabled || config.algorithm !== 'HYBRID'}
            type="number" 
            value={config.agingThreshold} 
            onChange={(e) => setConfig({ ...config, agingThreshold: Number(e.target.value) })}
            min={1}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label>Time Quantum</Label>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Time slice per process for Round Robin / Hybrid.</p>
              </TooltipContent>
            </Tooltip>
          </div>
          {config.algorithm === 'HYBRID' ? (
             <Input disabled value="Adaptive" />
          ) : (
            <Input 
              disabled={disabled || config.algorithm !== 'ROUND_ROBIN'}
              type="number" 
              value={config.timeQuantum} 
              onChange={(e) => setConfig({ ...config, timeQuantum: Number(e.target.value) })}
              min={1}
            />
          )}
        </div>
      </div>

      {config.algorithm === 'HYBRID' && (
        <div className="bg-secondary/50 rounded-lg p-4 flex flex-col md:flex-row gap-4 justify-between items-center text-sm">
          <div className="flex items-center gap-2 text-primary font-medium">
            <Info className="w-4 h-4" /> Adaptive Quantum
          </div>
          <div className="flex gap-6 text-muted-foreground">
            <span>1-2 processes &rarr; <strong className="text-foreground">Q4</strong></span>
            <span>3-5 processes &rarr; <strong className="text-foreground">Q3</strong></span>
            <span>6+ processes &rarr; <strong className="text-foreground">Q2</strong></span>
          </div>
        </div>
      )}
    </Card>
  );
};
