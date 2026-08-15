import React from 'react';
import { ComparisonResult } from '@/lib/types';
import { Zap, FastForward, Clock, ArrowDownToLine, Info } from 'lucide-react';

interface Props {
  result: ComparisonResult;
}

export const HybridInsightsPanel = ({ result }: Props) => {
  const hybrid = result.results['HYBRID'];
  const rr = result.results['ROUND_ROBIN'];
  const fcfs = result.results['FCFS'];

  if (!hybrid || !rr || !fcfs) return null;

  const hWait = hybrid.metrics.averageWaitingTime;
  const rrWait = rr.metrics.averageWaitingTime;
  const fcfsWait = fcfs.metrics.averageWaitingTime;

  const waitImprovementRR = rrWait > 0 ? ((rrWait - hWait) / rrWait) * 100 : 0;
  const waitImprovementFCFS = fcfsWait > 0 ? ((fcfsWait - hWait) / fcfsWait) * 100 : 0;

  let agingCount = 0;
  let preemptionCount = 0;

  hybrid.events.forEach(e => {
    if (e.type === 'AGING') agingCount++;
    if (e.type === 'PREEMPTION') preemptionCount++;
  });

  const bestAlgoWait = Object.entries(result.results).reduce((best, [algo, data]) => {
    return data.metrics.averageWaitingTime < best.val ? { algo, val: data.metrics.averageWaitingTime } : best;
  }, { algo: 'HYBRID', val: hWait });

  return (
    <div className="bg-gradient-to-br from-green-950/20 to-emerald-900/10 border border-green-500/20 rounded-xl p-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
      
      <div className="flex items-start gap-4 mb-6 relative z-10">
        <div className="p-3 bg-green-500/20 rounded-lg text-green-400">
          <Zap className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-green-50">HYBRID INSIGHTS</h2>
          <p className="text-green-500/80 font-medium">Why Adaptive Hybrid scheduling works for this workload</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        <div className="space-y-4">
          <h3 className="font-semibold text-green-300">Performance vs Classical</h3>
          
          {bestAlgoWait.algo === 'HYBRID' ? (
            <p className="text-sm text-green-100">
              The Adaptive Hybrid scheduler achieved the <strong className="text-white">lowest average waiting time</strong> for this workload.
            </p>
          ) : (
            <p className="text-sm text-green-100">
              For this specific workload, {bestAlgoWait.algo} had lower waiting time, but Hybrid maintained starvation bounds.
            </p>
          )}

          <div className="space-y-2 mt-4">
            {waitImprovementRR > 0 && (
              <div className="flex items-center gap-3 bg-black/20 p-3 rounded-md border border-white/5">
                <ArrowDownToLine className="w-4 h-4 text-green-400" />
                <span className="text-sm text-green-50">
                  <strong className="text-green-400">{waitImprovementRR.toFixed(1)}% lower</strong> waiting time vs Round Robin
                </span>
              </div>
            )}
            {waitImprovementFCFS > 0 && (
              <div className="flex items-center gap-3 bg-black/20 p-3 rounded-md border border-white/5">
                <ArrowDownToLine className="w-4 h-4 text-green-400" />
                <span className="text-sm text-green-50">
                  <strong className="text-green-400">{waitImprovementFCFS.toFixed(1)}% lower</strong> waiting time vs FCFS
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-green-300">Engine Behavior Trace</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-black/20 p-4 rounded-md border border-white/5 text-center">
              <div className="text-3xl font-bold text-green-400 mb-1">{agingCount}</div>
              <div className="text-xs text-green-500/80 uppercase tracking-widest flex items-center justify-center gap-1">
                <FastForward className="w-3 h-3" /> Promotions
              </div>
            </div>
            
            <div className="bg-black/20 p-4 rounded-md border border-white/5 text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-1">{preemptionCount}</div>
              <div className="text-xs text-yellow-500/80 uppercase tracking-widest flex items-center justify-center gap-1">
                <Zap className="w-3 h-3" /> Preemptions
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-2 text-xs text-green-100/70 mt-4 bg-black/10 p-3 rounded">
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-blue-400" />
            <p>
              {agingCount > 0 
                ? `${agingCount} processes were waiting too long in the Batch queue and were automatically promoted to Interactive by the starvation prevention mechanism.` 
                : 'No processes reached the starvation threshold during this simulation run.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
