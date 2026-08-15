import React from 'react';
import { Cpu } from 'lucide-react';

export const Logo = () => {
  return (
    <div className="flex items-center gap-2 text-primary font-bold text-xl tracking-tight">
      <Cpu className="w-6 h-6" />
      <div>
        <span>SchedX</span>
        <span className="block text-[10px] text-muted-foreground font-medium uppercase tracking-wider leading-none mt-0.5">
          Adaptive CPU Scheduler
        </span>
      </div>
    </div>
  );
};
