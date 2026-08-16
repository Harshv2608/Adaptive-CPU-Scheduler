import React from 'react';
import { ComparisonResult, AlgorithmType } from '@/lib/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface Props {
  result: ComparisonResult;
}

const ALGOS: { id: AlgorithmType; label: string; color: string }[] = [
  { id: 'FCFS', label: 'FCFS', color: '#94a3b8' },
  { id: 'SJF', label: 'SJF', color: '#fbbf24' },
  { id: 'PRIORITY', label: 'Priority', color: '#c084fc' },
  { id: 'ROUND_ROBIN', label: 'Round Robin', color: '#38bdf8' },
  { id: 'HYBRID', label: 'Adaptive Hybrid', color: '#4ade80' }
];

export const MetricsComparisonCharts = ({ result }: Props) => {
  const chartData = ALGOS.map(algo => {
    const res = result.results[algo.id];
    const metrics = res?.metrics;
    
    let preemptionCount = 0;
    let agingCount = 0;
    
    res?.events?.forEach(e => {
      if (e.type === 'PREEMPTION') preemptionCount++;
      if (e.type === 'AGING') agingCount++;
    });

    return {
      name: algo.label,
      wait: metrics?.averageWaitingTime || 0,
      turnaround: metrics?.averageTurnaroundTime || 0,
      response: metrics?.averageResponseTime || 0,
      cpu: metrics?.cpuUtilization || 0,
      contextSwitches: metrics?.contextSwitches || 0,
      preemptions: preemptionCount,
      aging: agingCount,
      algo: algo.id,
      color: algo.color
    };
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {/* Waiting Time Chart */}
      <div className="bg-card border rounded-lg p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-muted-foreground tracking-widest mb-6">AVERAGE WAITING TIME</h3>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
              <XAxis dataKey="name" tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }} axisLine={false} tickLine={false} interval={0} />
              <YAxis tick={{ fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
              <RechartsTooltip cursor={{ fill: 'var(--muted)', opacity: 0.2 }} contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }} />
              <Bar dataKey="wait" name="Avg Waiting Time" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Turnaround Time Chart */}
      <div className="bg-card border rounded-lg p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-muted-foreground tracking-widest mb-6">AVERAGE TURNAROUND TIME</h3>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
              <XAxis dataKey="name" tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }} axisLine={false} tickLine={false} interval={0} />
              <YAxis tick={{ fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
              <RechartsTooltip cursor={{ fill: 'var(--muted)', opacity: 0.2 }} contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }} />
              <Bar dataKey="turnaround" name="Avg Turnaround Time" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Response Time Chart */}
      <div className="bg-card border rounded-lg p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-muted-foreground tracking-widest mb-6">AVERAGE RESPONSE TIME</h3>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
              <XAxis dataKey="name" tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }} axisLine={false} tickLine={false} interval={0} />
              <YAxis tick={{ fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
              <RechartsTooltip cursor={{ fill: 'var(--muted)', opacity: 0.2 }} contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }} />
              <Bar dataKey="response" name="Avg Response Time" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Context Switches Chart */}
      <div className="bg-card border rounded-lg p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-muted-foreground tracking-widest mb-6">CONTEXT SWITCHES</h3>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
              <XAxis dataKey="name" tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }} axisLine={false} tickLine={false} interval={0} />
              <YAxis tick={{ fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
              <RechartsTooltip cursor={{ fill: 'var(--muted)', opacity: 0.2 }} contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }} />
              <Bar dataKey="contextSwitches" name="Context Switches" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Preemptions Chart */}
      <div className="bg-card border rounded-lg p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-muted-foreground tracking-widest mb-6">PREEMPTIONS</h3>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
              <XAxis dataKey="name" tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }} axisLine={false} tickLine={false} interval={0} />
              <YAxis tick={{ fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
              <RechartsTooltip cursor={{ fill: 'var(--muted)', opacity: 0.2 }} contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }} />
              <Bar dataKey="preemptions" name="Preemptions" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Aging Promotions Chart */}
      <div className="bg-card border rounded-lg p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-muted-foreground tracking-widest mb-6">AGING PROMOTIONS</h3>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
              <XAxis dataKey="name" tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }} axisLine={false} tickLine={false} interval={0} />
              <YAxis tick={{ fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
              <RechartsTooltip cursor={{ fill: 'var(--muted)', opacity: 0.2 }} contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }} />
              <Bar dataKey="aging" name="Aging Promotions" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
