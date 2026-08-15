import React from 'react';
import { ProcessInput, ProcessType } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';

interface Props {
  activePid: number | null;
  process: ProcessInput | null;
  currentClass?: ProcessType;
}

export const CpuPanel = ({ activePid, process, currentClass }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-card border rounded-lg h-[200px] w-full max-w-sm relative overflow-hidden">
      <div className="absolute top-3 left-4 text-xs font-semibold text-muted-foreground tracking-widest">
        CPU
      </div>
      <div className="absolute top-3 right-4 flex items-center gap-2">
        <span className="relative flex h-3 w-3">
          {activePid ? (
            <>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </>
          ) : (
            <span className="relative inline-flex rounded-full h-3 w-3 bg-muted"></span>
          )}
        </span>
        <span className="text-xs text-muted-foreground">{activePid ? 'ACTIVE' : 'IDLE'}</span>
      </div>

      <div className="w-full h-full flex items-center justify-center mt-4">
        <AnimatePresence mode="wait">
          {activePid && process ? (
            <motion.div
              key={activePid}
              layoutId={`process-${activePid}`}
              initial={{ scale: 0.8, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="w-full max-w-[200px]"
            >
              <Card className={`p-4 border-2 flex flex-col items-center shadow-lg ${
                currentClass === 'REAL_TIME' ? 'border-[var(--color-process-rt)] bg-[var(--color-process-rt)]/10' :
                currentClass === 'INTERACTIVE' ? 'border-[var(--color-process-int)] bg-[var(--color-process-int)]/10' :
                'border-[var(--color-process-batch)] bg-[var(--color-process-batch)]/10'
              }`}>
                <span className="text-2xl font-bold mb-1">P{process.id}</span>
                <span className="text-xs uppercase tracking-wider font-semibold opacity-70">
                  {currentClass?.replace('_', '-')}
                </span>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-muted-foreground text-sm uppercase tracking-widest"
            >
              System Idle
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
