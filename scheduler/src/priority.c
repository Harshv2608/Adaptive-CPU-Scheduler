#include <stdio.h>
#include "../include/scheduler.h"

struct Result priority_scheduler(struct Process p[], int n) {
    int time = 0, completed = 0, busy_time = 0, context_switches = 0;
    float total_wt = 0, total_tat = 0, total_rt = 0;
    struct Result r;
    init_trace(&r.trace);
    r.total_time = 0;
    int running_idx = -1;

    while (completed < n) {
        for (int i = 0; i < n; i++) {
            if (p[i].arrival_time == time) {
                record_event(&r.trace, time, EVENT_ARRIVAL, p[i].pid, 0, 0, 0, 0, "Arrived");
            }
        }

        int idx = -1, highest = 9999;
        for (int i = 0; i < n; i++) {
            if (p[i].arrival_time <= time && p[i].remaining_time > 0 && p[i].priority < highest) {
                highest = p[i].priority;
                idx = i;
            }
        }

        if (idx != running_idx) {
            if (running_idx != -1 && p[running_idx].remaining_time > 0) {
                record_event(&r.trace, time, EVENT_PREEMPTION, p[running_idx].pid, 0, 0, 0, 0, "Preempted");
            }
            if (idx != -1) {
                context_switches++;
                char reason[50];
                sprintf(reason, "Priority %d", p[idx].priority);
                record_event(&r.trace, time, EVENT_DISPATCH, p[idx].pid, 0, 0, 0, 0, reason);
                if (!p[idx].started) {
                    p[idx].response_time = time - p[idx].arrival_time;
                    p[idx].started = 1;
                }
            } else {
                if (r.trace.event_count == 0 || r.trace.events[r.trace.event_count - 1].type != EVENT_IDLE) {
                    record_event(&r.trace, time, EVENT_IDLE, 0, 0, 0, 0, 0, "Idle");
                }
            }
            running_idx = idx;
        }

        if (running_idx != -1) {
            p[running_idx].remaining_time--;
            busy_time++;
            if (r.total_time < MAX_TIME) r.timeline[r.total_time++] = p[running_idx].pid;
            time++;

            if (p[running_idx].remaining_time == 0) {
                completed++;
                p[running_idx].completion_time = time;
                p[running_idx].turnaround_time = time - p[running_idx].arrival_time;
                p[running_idx].waiting_time = p[running_idx].turnaround_time - p[running_idx].burst_time;
                record_event(&r.trace, time, EVENT_COMPLETION, p[running_idx].pid, 0, 0, 0, 0, "Completed");
                
                total_wt += p[running_idx].waiting_time;
                total_tat += p[running_idx].turnaround_time;
                total_rt += p[running_idx].response_time;
                running_idx = -1;
            }
        } else {
            if (r.total_time < MAX_TIME) r.timeline[r.total_time++] = 0;
            time++;
        }
    }
    
    r.avg_wt = total_wt / n;
    r.avg_tat = total_tat / n;
    r.avg_rt = total_rt / n;
    r.cpu_util = (time > 0) ? ((float)busy_time / time) * 100 : 0.0;
    r.context_switches = context_switches;
    return r;
}
