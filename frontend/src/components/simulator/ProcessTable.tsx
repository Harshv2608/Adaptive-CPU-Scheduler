import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProcessInput, ProcessType } from '@/lib/types';
import { ProcessTypeSelector } from './ProcessTypeSelector';
import { Trash2, Plus } from 'lucide-react';

interface Props {
  processes: ProcessInput[];
  setProcesses: (processes: ProcessInput[]) => void;
  disabled?: boolean;
}

export const ProcessTable = ({ processes, setProcesses, disabled }: Props) => {
  const handleUpdate = (index: number, field: keyof ProcessInput, value: any) => {
    const updated = [...processes];
    updated[index] = { ...updated[index], [field]: value };
    setProcesses(updated);
  };

  const handleRemove = (index: number) => {
    const updated = processes.filter((_, i) => i !== index);
    setProcesses(updated);
  };

  const handleAdd = () => {
    if (processes.length >= 500) return;
    const newId = processes.length > 0 ? Math.max(...processes.map(p => p.id)) + 1 : 1;
    setProcesses([
      ...processes,
      { id: newId, arrivalTime: 0, burstTime: 1, priority: 3, type: 'INTERACTIVE' }
    ]);
  };

  // We only show the table header/data if there are processes, else we hide the table container
  // to avoid weird borders when empty (since we have a nice empty state in the parent now)
  if (processes.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold mb-1">Processes</h3>
          <p className="text-sm text-muted-foreground">Configure the workload for the simulation.</p>
        </div>
      </div>
      
      <div className="border rounded-md overflow-x-auto">
        <Table className="min-w-[600px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Arrival Time</TableHead>
              <TableHead>Burst Time</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead className="w-[300px]">Type</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {processes.map((p, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium text-muted-foreground">P{p.id}</TableCell>
                <TableCell>
                  <Input 
                    aria-label={`Arrival Time for Process ${p.id}`}
                    disabled={disabled}
                    type="number" 
                    min={0}
                    value={p.arrivalTime} 
                    onChange={(e) => handleUpdate(i, 'arrivalTime', Number(e.target.value))} 
                  />
                </TableCell>
                <TableCell>
                  <Input 
                    aria-label={`Burst Time for Process ${p.id}`}
                    disabled={disabled}
                    type="number" 
                    min={1}
                    value={p.burstTime} 
                    onChange={(e) => handleUpdate(i, 'burstTime', Number(e.target.value))} 
                  />
                </TableCell>
                <TableCell>
                  <Input 
                    aria-label={`Priority for Process ${p.id}`}
                    disabled={disabled}
                    type="number" 
                    min={0}
                    value={p.priority} 
                    onChange={(e) => handleUpdate(i, 'priority', Number(e.target.value))} 
                  />
                </TableCell>
                <TableCell>
                  <ProcessTypeSelector 
                    disabled={disabled}
                    value={p.type} 
                    onChange={(val) => handleUpdate(i, 'type', val)} 
                  />
                </TableCell>
                <TableCell>
                  <Button 
                    aria-label={`Remove Process ${p.id}`}
                    disabled={disabled}
                    variant="ghost" 
                    size="icon" 
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleRemove(i)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Button variant="outline" className="w-full border-dashed" onClick={handleAdd} disabled={disabled || processes.length >= 500}>
        <Plus className="w-4 h-4 mr-2" /> Add Process
      </Button>
    </div>
  );
};
