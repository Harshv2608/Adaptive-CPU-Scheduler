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
    const metrics = result.results[algo.id]?.metrics;
    return {
      name: algo.label,
      wait: metrics?.averageWaitingTime || 0,
      turnaround: metrics?.averageTurnaroundTime || 0,
      cpu: metrics?.cpuUtilization || 0,
      algo: algo.id,
      color: algo.color
    };
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Waiting Time Chart */}
      <div className="bg-card border rounded-lg p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-muted-foreground tracking-widest mb-6">AVERAGE WAITING TIME</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
              <XAxis dataKey="name" tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
              <RechartsTooltip 
                cursor={{ fill: 'var(--muted)', opacity: 0.2 }}
                contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }}
              />
              <Bar dataKey="wait" name="Avg Waiting Time" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Turnaround Time Chart */}
      <div className="bg-card border rounded-lg p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-muted-foreground tracking-widest mb-6">AVERAGE TURNAROUND TIME</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
              <XAxis dataKey="name" tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
              <RechartsTooltip 
                cursor={{ fill: 'var(--muted)', opacity: 0.2 }}
                contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }}
              />
              <Bar dataKey="turnaround" name="Avg Turnaround Time" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
