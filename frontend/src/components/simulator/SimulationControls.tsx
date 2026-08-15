import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCcw, Play, Share2 } from 'lucide-react';

interface Props {
  onRun: () => void;
  onReset: () => void;
  onShare?: () => void;
  isSimulating: boolean;
  disabled?: boolean;
}

export const SimulationControls = ({ onRun, onReset, onShare, isSimulating, disabled }: Props) => {
  return (
    <div className="flex items-center justify-between p-6 bg-card border-t border-border mt-auto shrink-0">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onReset} disabled={disabled || isSimulating}>
          Reset
        </Button>
        {onShare && (
          <Button variant="secondary" onClick={onShare} disabled={disabled || isSimulating}>
            <Share2 className="w-4 h-4 mr-2" /> Share Workload
          </Button>
        )}
      </div>
      
      <Button size="lg" onClick={onRun} disabled={disabled || isSimulating} className="min-w-[200px]">
        {isSimulating ? (
          <>
            <RefreshCcw className="w-4 h-4 mr-2 animate-spin" /> Running Simulation...
          </>
        ) : (
          <>
            <Play className="w-4 h-4 mr-2" /> Run Simulation
          </>
        )}
      </Button>
    </div>
  );
};
