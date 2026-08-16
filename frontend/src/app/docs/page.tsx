import { PageContainer } from "@/components/layout/PageContainer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Box, Code2, Rocket, Server, Settings2 } from "lucide-react";

export default function DocsPage() {
  return (
    <PageContainer>
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold mb-4 tracking-tight">Documentation</h1>
        <p className="text-muted-foreground text-lg max-w-3xl">
          Everything you need to understand, run, and extend SchedX.
        </p>
      </div>

      <Tabs defaultValue="architecture" className="flex flex-col md:flex-row gap-8">
        <TabsList className="flex flex-col h-auto w-full md:w-64 bg-transparent justify-start items-stretch p-0 gap-2 border-r pr-4">
          <TabsTrigger value="getting-started" className="justify-start px-4 py-3 data-[state=active]:bg-primary/10">
            <Rocket className="w-4 h-4 mr-3" /> Getting Started
          </TabsTrigger>
          <TabsTrigger value="architecture" className="justify-start px-4 py-3 data-[state=active]:bg-primary/10">
            <Box className="w-4 h-4 mr-3" /> Architecture
          </TabsTrigger>
          <TabsTrigger value="hybrid" className="justify-start px-4 py-3 data-[state=active]:bg-primary/10">
            <Settings2 className="w-4 h-4 mr-3" /> Adaptive Hybrid
          </TabsTrigger>
          <TabsTrigger value="api" className="justify-start px-4 py-3 data-[state=active]:bg-primary/10">
            <Code2 className="w-4 h-4 mr-3" /> API Reference
          </TabsTrigger>
          <TabsTrigger value="deployment" className="justify-start px-4 py-3 data-[state=active]:bg-primary/10">
            <Server className="w-4 h-4 mr-3" /> Deployment & Testing
          </TabsTrigger>
        </TabsList>

        <div className="flex-1">
          <TabsContent value="getting-started" className="space-y-6 mt-0">
            <h2 className="text-3xl font-bold mb-6">Getting Started</h2>
            <div className="prose prose-invert max-w-none">
              <p>SchedX requires both Node.js (v18+) and a C compiler (GCC or Clang) installed on your system.</p>
              
              <h3 className="text-xl font-semibold mt-8 mb-4 text-primary">1. Clone & Build the C Engine</h3>
              <pre className="bg-black p-4 rounded-lg overflow-x-auto text-sm border">
                <code className="text-green-400">
                  gcc src/scheduler.c -o build/scheduler
                </code>
              </pre>

              <h3 className="text-xl font-semibold mt-8 mb-4 text-primary">2. Start the Backend API</h3>
              <pre className="bg-black p-4 rounded-lg overflow-x-auto text-sm border">
                <code className="text-green-400">
                  npm install{'\n'}
                  npm run start:backend
                </code>
              </pre>
              <p className="text-muted-foreground mt-2">Runs the Express server on port 3001.</p>

              <h3 className="text-xl font-semibold mt-8 mb-4 text-primary">3. Start the Next.js Frontend</h3>
              <pre className="bg-black p-4 rounded-lg overflow-x-auto text-sm border">
                <code className="text-green-400">
                  cd frontend{'\n'}
                  npm install{'\n'}
                  npm run dev
                </code>
              </pre>
              <p className="text-muted-foreground mt-2">Runs the React interface on port 3000.</p>
            </div>
          </TabsContent>

          <TabsContent value="architecture" className="space-y-6 mt-0">
            <h2 className="text-3xl font-bold mb-6">System Architecture</h2>
            
            <Card className="bg-[#0d1117] border-border p-6 mb-8 overflow-x-auto">
              <pre className="text-sm font-mono text-muted-foreground leading-relaxed min-w-[600px]">
                <span className="text-blue-400">       [Next.js Frontend]</span>{'\n'}
                <span className="text-blue-200">       Port 3000 / React / TypeScript</span>{'\n'}
                {'       '}│{'\n'}
                {'       '}│ <span className="text-yellow-400">HTTP POST /api/simulate (JSON)</span>{'\n'}
                {'       '}▼{'\n'}
                <span className="text-green-400">       [Express Backend]</span>{'\n'}
                <span className="text-green-200">       Port 3001 / Node.js</span>{'\n'}
                {'       '}│{'\n'}
                {'       '}│ <span className="text-purple-400">child_process.spawn()</span>{'\n'}
                {'       '}│ <span className="text-purple-400">stdin: JSON Config</span>{'\n'}
                {'       '}▼{'\n'}
                <span className="text-red-400">       [C Scheduler Engine]</span>{'\n'}
                <span className="text-red-200">       High-Performance Native Binary</span>{'\n'}
                {'       '}│{'\n'}
                {'       '}│ <span className="text-purple-400">stdout: JSON Execution Trace</span>{'\n'}
                {'       '}▼{'\n'}
                <span className="text-green-400">       [Express Backend]</span>{'\n'}
                {'       '}│{'\n'}
                {'       '}│ <span className="text-yellow-400">HTTP 200 OK (JSON)</span>{'\n'}
                {'       '}▼{'\n'}
                <span className="text-blue-400">       [Next.js Frontend]</span>{'\n'}
                <span className="text-blue-200">       Gantt Chart & Analytics Render</span>
              </pre>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-3 text-primary">Why C?</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  OS scheduling is deeply tied to low-level systems programming. Writing the core engine in C ensures the project maintains academic rigor and mimics how the Linux scheduler actually operates, rather than just faking it in JavaScript.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3 text-primary">Why Next.js?</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  While C is great for computing logic, it is terrible for drawing interactive charts. Next.js, combined with shadcn/ui and Recharts, provides a modern, accessible, and highly interactive layer to visualize the C engine's output.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="hybrid" className="space-y-6 mt-0">
            <h2 className="text-3xl font-bold mb-6">Adaptive Hybrid Internals</h2>
            <div className="prose prose-invert max-w-none">
              <p>The Hybrid Scheduler is a custom Multi-Level Queue (MLQ) with dynamic feedback.</p>
              
              <ul className="space-y-4 list-none pl-0 mt-6">
                <li className="p-4 bg-muted/30 rounded-lg border">
                  <strong className="text-primary block mb-2">1. The Aging Mechanism</strong>
                  The engine tracks `waiting_time` for every process in the BATCH queue. At each tick, if `waiting_time &gt; AGING_THRESHOLD`, the process is promoted to the INTERACTIVE queue, and an `AGING` event is emitted to the JSON trace.
                </li>
                <li className="p-4 bg-muted/30 rounded-lg border">
                  <strong className="text-primary block mb-2">2. Adaptive Quantum</strong>
                  Unlike standard Round Robin with a fixed time slice, the INTERACTIVE queue dynamically recalculates the time quantum based on load. 
                  <code className="block mt-2 p-2 bg-black rounded text-green-400 text-sm">quantum = max(1, base_quantum - (interactive_count / 5))</code>
                </li>
                <li className="p-4 bg-muted/30 rounded-lg border">
                  <strong className="text-primary block mb-2">3. Strict Preemption</strong>
                  If a REAL_TIME process arrives, the dispatcher immediately interrupts any running BATCH or INTERACTIVE process, executing a context switch on the exact tick of arrival.
                </li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="api" className="space-y-6 mt-0">
            <h2 className="text-3xl font-bold mb-6">JSON API Specification</h2>
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-bold text-primary mb-2">POST /api/simulate</h3>
                <p className="text-sm text-muted-foreground mb-4">Executes a simulation run.</p>
                
                <h4 className="font-semibold text-sm mb-2 text-muted-foreground tracking-widest">REQUEST PAYLOAD</h4>
                <pre className="bg-[#0d1117] p-4 rounded-lg overflow-x-auto text-sm border text-blue-300">
{`{
  "processes": [
    { "id": 1, "arrivalTime": 0, "burstTime": 5, "priority": 2, "type": "BATCH" }
  ],
  "config": {
    "algorithm": "HYBRID",
    "timeQuantum": 4,
    "agingThreshold": 10,
    "totalTime": 500
  }
}`}
                </pre>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-2 text-muted-foreground tracking-widest mt-6">RESPONSE TRACE</h4>
                <pre className="bg-[#0d1117] p-4 rounded-lg overflow-x-auto text-sm border text-green-300">
{`{
  "timeline": [
    { "start": 0, "end": 5, "processId": 1 }
  ],
  "events": [
    { "time": 0, "type": "ARRIVAL", "processId": 1 },
    { "time": 0, "type": "DISPATCH", "processId": 1 }
  ],
  "metrics": {
    "averageWaitingTime": 0.0,
    "averageTurnaroundTime": 5.0,
    "averageResponseTime": 0.0,
    "cpuUtilization": 100.0,
    "contextSwitches": 1
  }
}`}
                </pre>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="deployment" className="space-y-6 mt-0">
            <h2 className="text-3xl font-bold mb-6">Deployment & Testing</h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold mb-3 text-primary">Docker Deployment</h3>
                <p className="text-muted-foreground mb-4">SchedX uses a multi-stage Dockerfile to compile the C binary in an Alpine Linux container, followed by installing Node.js dependencies.</p>
                <pre className="bg-black p-4 rounded-lg overflow-x-auto text-sm border text-green-400">
                  docker build -t schedx .{'\n'}
                  docker run -p 3001:3001 schedx
                </pre>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3 text-primary">Automated Verification</h3>
                <p className="text-muted-foreground mb-4">The codebase guarantees correctness through dual-layer testing:</p>
                <ul className="space-y-2 list-disc pl-5 text-sm text-muted-foreground">
                  <li><strong>Jest (Backend):</strong> Tests Express API edge cases, timeout handling, and JSON schema validation.</li>
                  <li><strong>Python Invariants (C Engine):</strong> <code className="bg-muted px-1 rounded">tests/test_invariants.py</code> executes the C binary with thousands of random permutations to guarantee CPU Utilization is correct, no processes are dropped, and Gantt timelines are perfectly contiguous.</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </PageContainer>
  );
}
