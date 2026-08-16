import React from 'react';
import { ReadyQueueProcess } from '@/lib/simulation-utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';

interface Props {
  queue: ReadyQueueProcess[];
}

export const ReadyQueue = ({ queue }: Props) => {
  return (
    <div className="flex flex-col p-6 bg-card border rounded-lg h-[200px] w-full relative">
      <div className="text-xs font-semibold text-muted-foreground tracking-widest mb-4">
        READY QUEUE
      </div>

      <div className="flex-1 overflow-x-auto flex items-center gap-3 pb-2">
        <AnimatePresence mode="popLayout">
          {queue.length === 0 ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-muted-foreground text-sm italic w-full text-center"
            >
              Queue is empty
            </motion.div>
          ) : (
            queue.map((p) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.8, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="shrink-0"
              >
                <Card className={`p-3 border-2 flex flex-col items-center min-w-[80px] ${
                  p.currentClass === 'REAL_TIME' ? 'border-[var(--color-process-rt)]/50' :
                  p.currentClass === 'INTERACTIVE' ? 'border-[var(--color-process-int)]/50' :
                  'border-[var(--color-process-batch)]/50'
                }`}>
                  <span className="font-bold">P{p.id}</span>
                  <div className="flex flex-col items-center mt-1">
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground">
                      {p.currentClass?.replace('_', '-')}
                    </span>
                    <span className="text-[10px] mt-0.5">
                      Left: {p.remainingTime}
                    </span>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
