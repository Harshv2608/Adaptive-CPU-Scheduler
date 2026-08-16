import React, { useState } from 'react';
import { SimulationEvent } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowRight, Clock, FastForward, Play, Zap, CheckCircle2, Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  events: SimulationEvent[];
}

export const EventTimeline = ({ events }: Props) => {
  const [filter, setFilter] = useState<string>('ALL');

  const filteredEvents = events.filter(e => {
    if (filter === 'ALL') return true;
    if (filter === 'CPU') return e.type === 'DISPATCH' || e.type === 'PREEMPTION';
    return e.type === filter;
  });

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'ARRIVAL': return <ArrowRight className="w-4 h-4 text-blue-400" />;
      case 'DISPATCH': return <Play className="w-4 h-4 text-green-400" />;
      case 'PREEMPTION': return <Zap className="w-4 h-4 text-yellow-500" />;
      case 'QUANTUM_EXPIRE': return <Clock className="w-4 h-4 text-orange-400" />;
      case 'AGING': return <FastForward className="w-4 h-4 text-purple-400" />;
      case 'COMPLETION': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'IDLE': return <Circle className="w-4 h-4 text-muted-foreground" />;
      default: return <Circle className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex flex-col bg-card border rounded-lg h-[400px]">
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="text-sm font-semibold text-muted-foreground tracking-widest">
          EVENT TIMELINE
        </h3>
        <div className="flex gap-2">
          {['ALL', 'CPU', 'PREEMPTION', 'AGING', 'COMPLETION'].map(f => (
            <button
              key={f}
              aria-label={`Filter events by ${f}`}
              onClick={() => setFilter(f)}
              className={`text-xs px-2 py-1 rounded-md transition-colors ${
                filter === f ? 'bg-primary text-primary-foreground font-medium' : 'hover:bg-muted text-muted-foreground'
              }`}
            >
              {f === 'CPU' ? 'Dispatch' : f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          <AnimatePresence>
            {filteredEvents.map((e, idx) => (
              <motion.div
                key={`${e.time}-${e.processId}-${e.type}-${idx}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex gap-3 text-sm"
              >
                <div className="flex flex-col items-center mt-1">
                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                    {getEventIcon(e.type)}
                  </div>
                  {idx !== filteredEvents.length - 1 && (
                    <div className="w-px h-full bg-border my-1" />
                  )}
                </div>
                <div className="pb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-primary">t={e.time}</span>
                    {e.processId !== 0 && (
                      <span className="bg-secondary px-1.5 py-0.5 rounded text-xs font-medium">
                        P{e.processId}
                      </span>
                    )}
                  </div>
                  <div className="mt-1 font-medium">
                    {e.type === 'PREEMPTION' && '⚡ PREEMPTION'}
                    {e.type === 'AGING' && '🚀 AGING'}
                    {e.type !== 'PREEMPTION' && e.type !== 'AGING' && e.type.replace('_', ' ')}
                  </div>
                  <div className="text-muted-foreground mt-1">
                    {e.reason}
                  </div>
                  {e.type === 'AGING' && e.details?.fromType && e.details?.toType && (
                    <div className="mt-1 text-xs px-2 py-1 bg-purple-500/10 text-purple-400 rounded border border-purple-500/20 inline-block">
                      {e.details.fromType.replace('_', '-')} &rarr; {e.details.toType.replace('_', '-')}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {filteredEvents.length === 0 && (
            <div className="text-center text-muted-foreground italic py-8">
              No events found.
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
