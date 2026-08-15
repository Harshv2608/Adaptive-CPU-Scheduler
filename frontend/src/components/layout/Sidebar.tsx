import React from 'react';
import Link from 'next/link';
import { Activity, LayoutDashboard, Settings2, FileText, BarChart3 } from 'lucide-react';

export const Sidebar = () => {
  const links = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Simulator', href: '/simulator', icon: Settings2 },
    { name: 'Algorithms', href: '/algorithms', icon: Activity },
    { name: 'Benchmarks', href: '/benchmarks', icon: BarChart3 },
    { name: 'Documentation', href: '/docs', icon: FileText },
  ];

  return (
    <div className="w-64 border-r border-border bg-card/50 hidden md:flex flex-col h-full shrink-0">
      <div className="p-4 flex-1">
        <nav className="space-y-1">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
            >
              <link.icon className="w-4 h-4" />
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};
