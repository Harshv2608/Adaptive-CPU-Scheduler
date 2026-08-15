#include <stdio.h>
#include "../include/scheduler.h"

struct Result sjf_scheduler(struct Process p[], int n) {
    int time = 0, completed = 0, busy_time = 0;
    float total_wt = 0, total_tat = 0, total_rt = 0;
    struct Result r;
    init_trace(&r.trace);
    r.total_time = 0;

    while (completed < n) {
        for (int i = 0; i < n; i++) {
            if (p[i].arrival_time == time) {
                record_event(&r.trace, time, EVENT_ARRIVAL, p[i].pid, 0, 0, 0, 0, "Arrived");
            }
        }

        int idx = -1, shortest = 9999;
        for (int i = 0; i < n; i++) {
            if (p[i].arrival_time <= time && p[i].remaining_time > 0 && p[i].burst_time < shortest) {
                shortest = p[i].burst_time;
                idx = i;
            }
        }

        if (idx == -1) {
            if (r.total_time < MAX_TIME) r.timeline[r.total_time++] = 0;
            if (r.trace.event_count == 0 || r.trace.events[r.trace.event_count - 1].type != EVENT_IDLE) {
                record_event(&r.trace, time, EVENT_IDLE, 0, 0, 0, 0, 0, "Idle");
            }
            time++;
            continue;
        }

        if (!p[idx].started) {
            p[idx].response_time = time - p[idx].arrival_time;
            p[idx].started = 1;
        }
        
        record_event(&r.trace, time, EVENT_DISPATCH, p[idx].pid, 0, 0, 0, 0, "SJF Dispatch");
        
        for (int t = 0; t < p[idx].burst_time; t++) {
            if (r.total_time < MAX_TIME) r.timeline[r.total_time++] = p[idx].pid;
            time++;
            busy_time++;
            for(int i = 0; i < n; i++) {
                if(p[i].arrival_time == time && p[i].remaining_time > 0)
                   record_event(&r.trace, time, EVENT_ARRIVAL, p[i].pid, 0, 0, 0, 0, "Arrived");
            }
        }
        
        p[idx].completion_time = time;
        p[idx].turnaround_time = p[idx].completion_time - p[idx].arrival_time;
        p[idx].waiting_time = p[idx].turnaround_time - p[idx].burst_time;
        p[idx].remaining_time = 0;
        completed++;
        
        record_event(&r.trace, time, EVENT_COMPLETION, p[idx].pid, 0, 0, 0, 0, "Completed");
        
        total_wt += p[idx].waiting_time;
        total_tat += p[idx].turnaround_time;
        total_rt += p[idx].response_time;
    }
    
    r.avg_wt = total_wt / n;
    r.avg_tat = total_tat / n;
    r.avg_rt = total_rt / n;
    r.cpu_util = (time > 0) ? ((float)busy_time / time) * 100 : 0.0;
    return r;
}
