#include <stdio.h>
#include "../include/scheduler.h"

struct Result fcfs_scheduler(struct Process p[], int n) {
    int time = 0;
    float total_wt = 0, total_tat = 0;
    struct Result r;
    init_trace(&r.trace);
    r.total_time = 0;

    for (int i = 0; i < n; i++) {
        if (time < p[i].arrival_time) {
            time = p[i].arrival_time;
        }

        if (!p[i].started) {
            p[i].response_time = time - p[i].arrival_time;
            p[i].started = 1;
        }

        record_event(&r.trace, time, EVENT_DISPATCH, p[i].pid, 0, 0, 0, 0, "FCFS Dispatch");

        for (int t = 0; t < p[i].burst_time; t++) {
            if (r.total_time < MAX_TIME) r.timeline[r.total_time++] = p[i].pid;
            time++;
        }

        p[i].completion_time = time;
        p[i].turnaround_time = p[i].completion_time - p[i].arrival_time;
        p[i].waiting_time = p[i].turnaround_time - p[i].burst_time;
        
        record_event(&r.trace, time, EVENT_COMPLETION, p[i].pid, 0, 0, 0, 0, "Completed");

        total_wt += p[i].waiting_time;
        total_tat += p[i].turnaround_time;
    }

    r.avg_wt = total_wt / n;
    r.avg_tat = total_tat / n;
    r.cpu_util = 100.0;
    return r;
}
