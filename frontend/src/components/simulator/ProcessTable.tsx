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
    if (processes.length >= 10) return; // arbitrary max
    const newId = processes.length > 0 ? Math.max(...processes.map(p => p.id)) + 1 : 1;
    setProcesses([
      ...processes,
      { id: newId, arrivalTime: 0, burstTime: 1, priority: 3, type: 'INTERACTIVE' }
    ]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold mb-1">Processes</h3>
          <p className="text-sm text-muted-foreground">Configure the workload for the simulation.</p>
        </div>
      </div>
      
      <div className="border rounded-md">
        <Table>
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
            {processes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  No processes defined. Load a preset or add one.
                </TableCell>
              </TableRow>
            ) : (
              processes.map((p, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium text-muted-foreground">P{p.id}</TableCell>
                  <TableCell>
                    <Input 
                      disabled={disabled}
                      type="number" 
                      min={0}
                      value={p.arrivalTime} 
                      onChange={(e) => handleUpdate(i, 'arrivalTime', Number(e.target.value))} 
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      disabled={disabled}
                      type="number" 
                      min={1}
                      value={p.burstTime} 
                      onChange={(e) => handleUpdate(i, 'burstTime', Number(e.target.value))} 
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
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
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Button variant="outline" className="w-full border-dashed" onClick={handleAdd} disabled={disabled || processes.length >= 10}>
        <Plus className="w-4 h-4 mr-2" /> Add Process
      </Button>
    </div>
  );
};
