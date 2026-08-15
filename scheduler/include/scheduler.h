#ifndef SCHEDULER_H
#define SCHEDULER_H

#include "process.h"
#include "trace.h"

#define MAX_TIME 500
#define AGING_THRESHOLD 10

struct Result {
    float avg_wt;
    float avg_tat;
    float avg_rt;
    float cpu_util;
    int context_switches;
    
    // For outputting timeline
    int timeline[MAX_TIME];
    int total_time;
    
    // Trace events
    struct Trace trace;
};

struct Result hybrid_scheduler(struct Process p[], int n, int aging_threshold);
struct Result fcfs_scheduler(struct Process p[], int n);
struct Result sjf_scheduler(struct Process p[], int n);
struct Result priority_scheduler(struct Process p[], int n);
struct Result round_robin_scheduler(struct Process p[], int n, int quantum);

#endif
