import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Cpu, LayoutList, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { ProcessTypeBadge } from "@/components/process/ProcessTypeBadge";

export default function Home() {
  return (
    <PageContainer>
      <div className="flex flex-col items-center justify-center text-center space-y-8 mt-12 mb-16">
        <div className="space-y-4 max-w-2xl">
          <h1 className="text-5xl font-extrabold tracking-tight">
            SchedX
          </h1>
          <p className="text-2xl font-medium text-muted-foreground">
            Adaptive CPU Scheduling Simulator
          </p>
          <p className="text-base text-muted-foreground pt-4">
            Understand how modern operating systems decide which process gets the CPU next.
            Visualize scheduling policies, quantum dynamics, and starvation prevention in real-time.
          </p>
        </div>

        <Link href="/simulator">
          <Button size="lg" className="h-14 px-8 text-lg gap-2 mt-4">
            Launch Simulator <ArrowRight className="w-5 h-5" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
        <Card className="p-6 flex flex-col items-center text-center space-y-4 bg-card/40 border-border/50 hover:bg-card/80 transition-colors">
          <ProcessTypeBadge type="REAL_TIME" />
          <h3 className="font-semibold text-lg">Strict Priority</h3>
          <p className="text-sm text-muted-foreground">Preempts other workloads. Always executes first when ready.</p>
        </Card>
        
        <Card className="p-6 flex flex-col items-center text-center space-y-4 bg-card/40 border-border/50 hover:bg-card/80 transition-colors">
          <ProcessTypeBadge type="INTERACTIVE" />
          <h3 className="font-semibold text-lg">Adaptive Round Robin</h3>
          <p className="text-sm text-muted-foreground">Time quantum scales dynamically based on system load.</p>
        </Card>
        
        <Card className="p-6 flex flex-col items-center text-center space-y-4 bg-card/40 border-border/50 hover:bg-card/80 transition-colors">
          <ProcessTypeBadge type="BATCH" />
          <h3 className="font-semibold text-lg">Shortest Job First</h3>
          <p className="text-sm text-muted-foreground">Optimized for throughput. Ages into Interactive if starved.</p>
        </Card>
      </div>
      
      <div className="mt-24 max-w-3xl mx-auto flex items-center justify-between text-muted-foreground opacity-50 px-8">
        <div className="flex flex-col items-center gap-2">
          <LayoutList className="w-8 h-8" />
          <span className="text-xs font-medium uppercase tracking-wider">Classification</span>
        </div>
        <div className="flex-1 h-px bg-border mx-4" />
        <div className="flex flex-col items-center gap-2">
          <Cpu className="w-8 h-8" />
          <span className="text-xs font-medium uppercase tracking-wider">Scheduling</span>
        </div>
        <div className="flex-1 h-px bg-border mx-4" />
        <div className="flex flex-col items-center gap-2">
          <CheckCircle2 className="w-8 h-8" />
          <span className="text-xs font-medium uppercase tracking-wider">Metrics</span>
        </div>
      </div>
    </PageContainer>
  );
}
