import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ProcessType } from '@/lib/types';

interface ProcessTypeBadgeProps {
  type: ProcessType;
}

export const ProcessTypeBadge = ({ type }: ProcessTypeBadgeProps) => {
  if (type === 'REAL_TIME') {
    return <Badge variant="outline" className="text-[var(--color-process-rt)] border-[var(--color-process-rt)]/30 bg-[var(--color-process-rt)]/10">Real-Time</Badge>;
  }
  if (type === 'INTERACTIVE') {
    return <Badge variant="outline" className="text-[var(--color-process-int)] border-[var(--color-process-int)]/30 bg-[var(--color-process-int)]/10">Interactive</Badge>;
  }
  return <Badge variant="outline" className="text-[var(--color-process-batch)] border-[var(--color-process-batch)]/30 bg-[var(--color-process-batch)]/10">Batch</Badge>;
};
