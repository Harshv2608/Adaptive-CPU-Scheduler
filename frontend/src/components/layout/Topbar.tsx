"use client";

import React, { useEffect, useState } from 'react';
import { Logo } from '../branding/Logo';
import { api } from '@/lib/api';
import { CheckCircle2, XCircle } from 'lucide-react';

export const Topbar = () => {
  const [isApiOnline, setIsApiOnline] = useState<boolean | null>(null);

  useEffect(() => {
    api.health()
      .then(() => setIsApiOnline(true))
      .catch(() => setIsApiOnline(false));
  }, []);

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 shrink-0">
      <Logo />
      
      <div className="flex items-center gap-2 text-sm font-medium">
        {isApiOnline === null ? (
          <span className="text-muted-foreground flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse" />
            Connecting...
          </span>
        ) : isApiOnline ? (
          <span className="text-[var(--color-process-int)] flex items-center gap-1.5 bg-[var(--color-process-int)]/10 px-2.5 py-1 rounded-full border border-[var(--color-process-int)]/20">
            <CheckCircle2 className="w-4 h-4" />
            Engine Online
          </span>
        ) : (
          <span className="text-destructive flex items-center gap-1.5 bg-destructive/10 px-2.5 py-1 rounded-full border border-destructive/20">
            <XCircle className="w-4 h-4" />
            Engine Offline
          </span>
        )}
      </div>
    </header>
  );
};
