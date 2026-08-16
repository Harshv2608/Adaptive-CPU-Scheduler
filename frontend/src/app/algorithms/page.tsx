'use client';

import React, { useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowDown, Clock, FastForward, Info, Layers, Zap } from 'lucide-react';

export default function AlgorithmsPage() {
  return (
    <PageContainer>
      <div className="mb-12">
        <h1 className="text-3xl font-bold mb-4">Scheduling Algorithms</h1>
        <p className="text-muted-foreground text-lg max-w-3xl">
          SchedX implements five CPU scheduling algorithms. Learn how each one makes dispatch decisions, 
          and dive deep into the architecture of the custom Adaptive Hybrid scheduler.
        </p>
      </div>

      <Tabs defaultValue="hybrid" className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto h-auto p-1 mb-8 border-b rounded-none bg-transparent">
          <TabsTrigger value="fcfs" className="px-6 py-3">FCFS</TabsTrigger>
          <TabsTrigger value="sjf" className="px-6 py-3">SJF</TabsTrigger>
          <TabsTrigger value="rr" className="px-6 py-3">Round Robin</TabsTrigger>
          <TabsTrigger value="priority" className="px-6 py-3">Priority</TabsTrigger>
          <TabsTrigger value="hybrid" className="px-6 py-3 font-bold text-primary data-[state=active]:bg-primary/10 data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none shadow-none">
            <Zap className="w-4 h-4 mr-2" /> Adaptive Hybrid
          </TabsTrigger>
        </TabsList>

        <TabsContent value="fcfs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>First-Come, First-Served (FCFS)</CardTitle>
              <CardDescription>The simplest scheduling algorithm.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-primary">Concept & How it works</h4>
                    <p className="text-sm text-muted-foreground">Processes are dispatched according to their arrival time. The ready queue is managed as a strict FIFO queue.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary">Preemption</h4>
                    <p className="text-sm text-muted-foreground"><strong>Non-preemptive.</strong> Once a process gets the CPU, it keeps it until it finishes its burst.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary">Complexity</h4>
                    <p className="text-sm text-muted-foreground">O(1) scheduling decision.</p>
                  </div>
                </div>
                <div className="space-y-4 bg-muted/30 p-4 rounded-lg border border-border/50">
                  <div>
                    <h4 className="font-semibold text-green-500">Strengths</h4>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground">
                      <li>Trivially easy to implement.</li>
                      <li>No starvation (every process eventually runs).</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-destructive">Weaknesses</h4>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground">
                      <li><strong>Convoy Effect:</strong> Short processes can get stuck behind long processes, leading to terrible average waiting times.</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-500">When to use it</h4>
                    <p className="text-sm text-muted-foreground">Background batch systems where turnaround time doesn't matter, or as a secondary tie-breaker algorithm.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sjf" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shortest Job First (SJF)</CardTitle>
              <CardDescription>Optimized for minimal waiting time.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-primary">Concept & How it works</h4>
                    <p className="text-sm text-muted-foreground">When the CPU is available, it is assigned to the process that has the smallest burst time. If two processes have the same burst, FCFS is used to break the tie.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary">Preemption</h4>
                    <p className="text-sm text-muted-foreground"><strong>Non-preemptive.</strong> (The preemptive version is called Shortest Remaining Time First).</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary">Complexity</h4>
                    <p className="text-sm text-muted-foreground">O(N) to find the shortest job in an unsorted queue, or O(log N) with a min-heap.</p>
                  </div>
                </div>
                <div className="space-y-4 bg-muted/30 p-4 rounded-lg border border-border/50">
                  <div>
                    <h4 className="font-semibold text-green-500">Strengths</h4>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground">
                      <li>Provably yields the minimum average waiting time for a given set of processes.</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-destructive">Weaknesses</h4>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground">
                      <li><strong>Starvation:</strong> Long processes may never execute if short processes keep arriving.</li>
                      <li>Impossible to implement perfectly in reality (cannot predict exact future burst times).</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-500">When to use it</h4>
                    <p className="text-sm text-muted-foreground">Long-term job scheduling where runtimes are estimated (e.g., rendering jobs, scientific computing).</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rr" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Round Robin (RR)</CardTitle>
              <CardDescription>Designed for time-sharing systems.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-primary">Concept & How it works</h4>
                    <p className="text-sm text-muted-foreground">A small unit of time (time quantum) is defined. The scheduler goes around the circular ready queue, allocating the CPU to each process for up to one quantum.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary">Preemption</h4>
                    <p className="text-sm text-muted-foreground"><strong>Preemptive.</strong> Processes are interrupted after their quantum expires.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary">Complexity</h4>
                    <p className="text-sm text-muted-foreground">O(1) scheduling decision.</p>
                  </div>
                </div>
                <div className="space-y-4 bg-muted/30 p-4 rounded-lg border border-border/50">
                  <div>
                    <h4 className="font-semibold text-green-500">Strengths</h4>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground">
                      <li>Excellent response time, ideal for interactive environments.</li>
                      <li>Fairness: Every process gets an equal share of the CPU.</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-destructive">Weaknesses</h4>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground">
                      <li>Performance depends entirely on the size of the time quantum.</li>
                      <li>Too large = degenerates to FCFS. Too small = excessive context switching overhead.</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-500">When to use it</h4>
                    <p className="text-sm text-muted-foreground">Interactive systems (like desktop OSs) where users expect immediate feedback.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="priority" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preemptive Priority</CardTitle>
              <CardDescription>Selects the highest priority process available.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-primary">Concept & How it works</h4>
                    <p className="text-sm text-muted-foreground">A priority is associated with each process. The CPU is allocated to the process with the highest priority.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary">Preemption</h4>
                    <p className="text-sm text-muted-foreground"><strong>Preemptive.</strong> If a new process arrives with a higher priority than the currently running process, it preempts it.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary">Complexity</h4>
                    <p className="text-sm text-muted-foreground">O(log N) with a priority queue (heap).</p>
                  </div>
                </div>
                <div className="space-y-4 bg-muted/30 p-4 rounded-lg border border-border/50">
                  <div>
                    <h4 className="font-semibold text-green-500">Strengths</h4>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground">
                      <li>Ensures critical, high-importance tasks are handled immediately.</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-destructive">Weaknesses</h4>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground">
                      <li><strong>Starvation:</strong> Low priority processes can wait indefinitely (the famous "MIT rumor" of 1973 where a low-priority job waited 10 years).</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-500">When to use it</h4>
                    <p className="text-sm text-muted-foreground">Real-time operating systems (RTOS), mission-critical systems, or as the top tier of a Multi-Level Queue.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hybrid" className="space-y-8 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Adaptive Hybrid Scheduler</h2>
              <p className="text-muted-foreground">
                The Hybrid Scheduler is a custom multi-level queue architecture designed to balance 
                strict real-time constraints with excellent interactive response times, while preventing batch starvation.
              </p>
              
              <div className="space-y-4 mt-8">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1"><Layers className="text-primary w-6 h-6" /></div>
                  <div>
                    <h3 className="font-bold text-lg">1. Real-Time Queue (Top Priority)</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Uses strictly <strong>Preemptive Priority</strong>. If a Real-Time process arrives, it instantly kicks out any Interactive or Batch process currently executing.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1"><Clock className="text-[var(--color-process-int)] w-6 h-6" /></div>
                  <div>
                    <h3 className="font-bold text-lg">2. Interactive Queue (Medium Priority)</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Uses <strong>Adaptive Round Robin</strong>. The time quantum dynamically shrinks as more processes enter this queue, ensuring high responsiveness under load.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1"><Info className="text-[var(--color-process-batch)] w-6 h-6" /></div>
                  <div>
                    <h3 className="font-bold text-lg">3. Batch Queue (Low Priority)</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Uses <strong>Shortest Remaining Time First (SRTF)</strong>. Maximizes throughput for background jobs when the CPU is otherwise idle.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card border rounded-xl p-8 relative shadow-lg">
              <h3 className="text-sm font-semibold text-muted-foreground tracking-widest mb-8 text-center">FLOW ARCHITECTURE</h3>
              
              <div className="space-y-8 max-w-sm mx-auto">
                <div className="bg-[var(--color-process-rt)]/10 border-2 border-[var(--color-process-rt)] rounded-lg p-4 text-center">
                  <h4 className="font-bold text-[var(--color-process-rt)] text-lg">REAL-TIME</h4>
                  <p className="text-xs text-muted-foreground mt-1">Preemptive Priority</p>
                </div>
                
                <div className="flex justify-center -my-4 relative z-10">
                  <ArrowDown className="text-muted-foreground" />
                </div>
                
                <div className="bg-[var(--color-process-int)]/10 border-2 border-[var(--color-process-int)] rounded-lg p-4 text-center">
                  <h4 className="font-bold text-[var(--color-process-int)] text-lg">INTERACTIVE</h4>
                  <p className="text-xs text-muted-foreground mt-1">Adaptive Round Robin</p>
                </div>
                
                <div className="flex justify-center -my-4 relative z-10">
                  <ArrowDown className="text-muted-foreground" />
                </div>
                
                <div className="bg-[var(--color-process-batch)]/10 border-2 border-[var(--color-process-batch)] rounded-lg p-4 text-center relative group">
                  <h4 className="font-bold text-[var(--color-process-batch)] text-lg">BATCH</h4>
                  <p className="text-xs text-muted-foreground mt-1">SRTF</p>
                  
                  {/* Aging Arrow Loop */}
                  <div className="absolute -left-12 top-1/2 bottom-full w-12 border-l-2 border-t-2 border-dashed border-purple-500/50 rounded-tl-xl 
                    -translate-y-1/2 -mt-24 h-48 flex items-center justify-start pointer-events-none group-hover:border-purple-500 transition-colors">
                    <div className="bg-background border border-purple-500 text-purple-400 text-[10px] font-bold px-2 py-1 rounded absolute -left-6 uppercase tracking-wider rotate-[-90deg]">
                      Aging
                    </div>
                    <div className="absolute top-0 right-0 -mr-1.5 -mt-1.5 w-3 h-3 border-t-2 border-r-2 border-purple-500 rotate-45"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}
