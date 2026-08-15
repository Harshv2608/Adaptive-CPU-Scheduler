#include <stdio.h>
#include "../include/scheduler.h"

struct Result round_robin_scheduler(struct Process p[], int n, int quantum) {
    int time = 0, completed = 0, busy_time = 0;
    float total_wt = 0, total_tat = 0, total_rt = 0;
    struct Result r;
    init_trace(&r.trace);
    r.total_time = 0;
    int last_idx = -1;

    while (completed < n) {
        for (int i = 0; i < n; i++) {
            if (p[i].arrival_time == time) {
                record_event(&r.trace, time, EVENT_ARRIVAL, p[i].pid, 0, 0, 0, 0, "Arrived");
            }
        }

        int idx = -1;
        for (int i = 1; i <= n; i++) {
            int j = (last_idx + i) % n;
            if (p[j].arrival_time <= time && p[j].remaining_time > 0) {
                idx = j;
                last_idx = j;
                break;
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
        
        record_event(&r.trace, time, EVENT_DISPATCH, p[idx].pid, 0, 0, 0, quantum, "RR turn");
        
        int slice = (p[idx].remaining_time < quantum) ? p[idx].remaining_time : quantum;
        for (int t = 0; t < slice; t++) {
            if (r.total_time < MAX_TIME) r.timeline[r.total_time++] = p[idx].pid;
            time++;
            busy_time++;
            
            for(int i = 0; i < n; i++) {
                if(p[i].arrival_time == time && p[i].remaining_time > 0 && p[i].pid != p[idx].pid)
                   record_event(&r.trace, time, EVENT_ARRIVAL, p[i].pid, 0, 0, 0, 0, "Arrived");
            }
        }
        
        p[idx].remaining_time -= slice;

        if (p[idx].remaining_time == 0) {
            completed++;
            p[idx].completion_time = time;
            p[idx].turnaround_time = time - p[idx].arrival_time;
            p[idx].waiting_time = p[idx].turnaround_time - p[idx].burst_time;
            record_event(&r.trace, time, EVENT_COMPLETION, p[idx].pid, 0, 0, 0, 0, "Completed");
            
            total_wt += p[idx].waiting_time;
            total_tat += p[idx].turnaround_time;
            total_rt += p[idx].response_time;
        } else {
            record_event(&r.trace, time, EVENT_QUANTUM_EXPIRE, p[idx].pid, 0, 0, 0, quantum, "Quantum Expired");
        }
    }
    
    r.avg_wt = total_wt / n;
    r.avg_tat = total_tat / n;
    r.avg_rt = total_rt / n;
    r.cpu_util = (time > 0) ? ((float)busy_time / time) * 100 : 0.0;
    return r;
}
