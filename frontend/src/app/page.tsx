import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Cpu, LayoutList, CheckCircle2, GitBranch, LineChart, FastForward, Activity, MonitorPlay } from "lucide-react";
import Link from "next/link";
import { ProcessTypeBadge } from "@/components/process/ProcessTypeBadge";

export default function Home() {
  return (
    <PageContainer>
      {/* HERO SECTION */}
      <div className="flex flex-col items-center justify-center text-center space-y-8 mt-12 mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
          v0.9.0 - Portfolio Release
        </div>
        
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight tracking-tighter">
            Sched<span className="text-primary">X</span>
          </h1>
          <p className="text-2xl font-medium text-muted-foreground mt-4">
            Adaptive CPU Scheduling Simulator
          </p>
          <p className="text-lg text-muted-foreground pt-4 leading-relaxed max-w-2xl mx-auto">
            Explore how modern operating systems allocate CPU time. SchedX bridges the gap between classic CS theory and modern multi-level queue systems by visualizing a custom C-based Hybrid Scheduler in real-time.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link href="/simulator">
            <Button size="lg" className="h-14 px-8 text-lg gap-2 w-full sm:w-auto font-semibold">
              <MonitorPlay className="w-5 h-5" /> Launch Simulator
            </Button>
          </Link>
          <Link href="https://github.com/Harshv2608/Adaptive-CPU-Scheduler" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="lg" className="h-14 px-8 text-lg gap-2 w-full sm:w-auto font-semibold">
              <GitBranch className="w-5 h-5" /> View on GitHub
            </Button>
          </Link>
        </div>
      </div>

      {/* FLOW DIAGRAM */}
      <div className="max-w-4xl mx-auto mt-20 mb-24 px-4 hidden md:block">
        <div className="flex items-center justify-between text-muted-foreground/80 font-medium text-sm">
          <div className="flex flex-col items-center gap-3 w-40 text-center">
            <div className="w-12 h-12 rounded-2xl bg-card border flex items-center justify-center shadow-sm">
              <Cpu className="w-6 h-6 text-primary" />
            </div>
            <span>Real OS Algorithms</span>
          </div>
          <ArrowRight className="w-5 h-5" />
          <div className="flex flex-col items-center gap-3 w-40 text-center">
            <div className="w-12 h-12 rounded-2xl bg-card border flex items-center justify-center shadow-sm">
              <Activity className="w-6 h-6 text-[var(--color-process-rt)]" />
            </div>
            <span>Adaptive Hybrid</span>
          </div>
          <ArrowRight className="w-5 h-5" />
          <div className="flex flex-col items-center gap-3 w-40 text-center">
            <div className="w-12 h-12 rounded-2xl bg-card border flex items-center justify-center shadow-sm">
              <LayoutList className="w-6 h-6 text-[var(--color-process-int)]" />
            </div>
            <span>Interactive Visuals</span>
          </div>
          <ArrowRight className="w-5 h-5" />
          <div className="flex flex-col items-center gap-3 w-40 text-center">
            <div className="w-12 h-12 rounded-2xl bg-card border flex items-center justify-center shadow-sm">
              <LineChart className="w-6 h-6 text-[var(--color-process-batch)]" />
            </div>
            <span>Performance Analytics</span>
          </div>
        </div>
      </div>

      {/* ARCHITECTURE PREVIEW */}
      <div className="max-w-5xl mx-auto mt-24 mb-32 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold tracking-tight">Polyglot Architecture</h2>
          <p className="text-lg text-muted-foreground">
            SchedX runs a true C-based scheduling engine compiled directly into the backend. By leveraging standard streams (stdin/stdout), the Node.js Express server acts as a bridge, streaming precise JSON simulation traces directly to the Next.js frontend.
          </p>
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span><strong>Next.js App Router</strong> (React, TypeScript, Tailwind)</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span><strong>Express API</strong> (Node.js, Child Processes)</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span><strong>Custom C Engine</strong> (High-Performance Scheduler)</span>
            </li>
          </ul>
        </div>
        <Card className="p-6 bg-[#0d1117] border-border overflow-hidden">
          <pre className="text-xs text-[#c9d1d9] font-mono leading-loose">
            <span className="text-[#ff7b72]">struct</span> Process {'{\n'}
            {'  '}int id;{'\n'}
            {'  '}int arrival_time;{'\n'}
            {'  '}int burst_time;{'\n'}
            {'  '}ProcessType type;{'\n'}
            {'}'};{'\n\n'}
            <span className="text-[#8b949e]">/* Adaptive Hybrid Evaluation */</span>{'\n'}
            <span className="text-[#ff7b72]">if</span> (proc.waiting_time &gt; AGING_THRESHOLD) {'{\n'}
            {'  '}promote_process(&amp;proc);{'\n'}
            {'  '}emit_event(<span className="text-[#a5d6ff]">"AGING"</span>, proc.id);{'\n'}
            {'}'}
          </pre>
        </Card>
      </div>

      {/* ALGORITHM FEATURES */}
      <div className="max-w-5xl mx-auto mt-20 mb-20 text-center">
        <h2 className="text-3xl font-bold tracking-tight mb-12">The Adaptive Hybrid Engine</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-8 flex flex-col items-center text-center space-y-4 bg-card/40 border-border/50 hover:bg-card/80 transition-colors">
            <ProcessTypeBadge type="REAL_TIME" />
            <h3 className="font-semibold text-xl mt-2">Strict Priority</h3>
            <p className="text-sm text-muted-foreground">Preempts other workloads. Always executes first when ready, minimizing response time for critical tasks.</p>
          </Card>
          
          <Card className="p-8 flex flex-col items-center text-center space-y-4 bg-card/40 border-border/50 hover:bg-card/80 transition-colors">
            <ProcessTypeBadge type="INTERACTIVE" />
            <h3 className="font-semibold text-xl mt-2">Adaptive Round Robin</h3>
            <p className="text-sm text-muted-foreground">Time quantum scales dynamically based on system load, balancing fairness and context-switch overhead.</p>
          </Card>
          
          <Card className="p-8 flex flex-col items-center text-center space-y-4 bg-card/40 border-border/50 hover:bg-card/80 transition-colors">
            <ProcessTypeBadge type="BATCH" />
            <h3 className="font-semibold text-xl mt-2">Shortest Job First</h3>
            <p className="text-sm text-muted-foreground">Optimized for sheer throughput. Built-in aging prevents starvation by promoting long-waiting jobs to Interactive.</p>
          </Card>
        </div>
      </div>

    </PageContainer>
  );
}
