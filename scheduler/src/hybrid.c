#include <stdio.h>
#include "../include/scheduler.h"

// Helper function to count ready interactive processes
static int count_ready_interactive(struct Process p[], int n, int current_time) {
    int count = 0;
    for (int i = 0; i < n; i++) {
        if (p[i].arrival_time <= current_time && p[i].remaining_time > 0 && p[i].current_class == INTERACTIVE) {
            count++;
        }
    }
    return count;
}

// Helper to determine adaptive quantum
static int get_adaptive_quantum(int interactive_count) {
    if (interactive_count >= 6) return 2;
    if (interactive_count >= 3) return 3;
    return 4; // 1-2 interactive processes
}

struct Result hybrid_scheduler(struct Process p[], int n) {
    int current_time = 0, completed = 0, last_interactive = -1;
    int busy_time = 0;
    float total_wt = 0, total_tat = 0, total_rt = 0;
    
    struct Result r;
    init_trace(&r.trace);
    r.total_time = 0;
    
    int running_idx = -1;
    int current_quantum = 0;
    int quantum_used = 0;
    
    // Initialize processes
    for (int i = 0; i < n; i++) {
        p[i].current_class = p[i].original_type;
        p[i].wait_time_in_class = 0;
        p[i].promotions = 0;
        p[i].started = 0;
    }

    while (completed < n) {
        // Record arrivals
        for (int i = 0; i < n; i++) {
            if (p[i].arrival_time == current_time) {
                record_event(&r.trace, current_time, EVENT_ARRIVAL, p[i].pid, 0, 0, 0, 0, "Arrived");
            }
        }
        
        // Handle Aging
        for (int i = 0; i < n; i++) {
            if (p[i].arrival_time <= current_time && p[i].remaining_time > 0 && i != running_idx) {
                p[i].wait_time_in_class++;
                if (p[i].wait_time_in_class >= AGING_THRESHOLD) {
                    int from = p[i].current_class;
                    if (p[i].current_class == BATCH) {
                        p[i].current_class = INTERACTIVE;
                        p[i].promotions++;
                        p[i].wait_time_in_class = 0;
                        record_event(&r.trace, current_time, EVENT_AGING, p[i].pid, from, INTERACTIVE, AGING_THRESHOLD, 0, "Promoted to Interactive");
                    } else if (p[i].current_class == INTERACTIVE) {
                        p[i].current_class = REAL_TIME;
                        p[i].promotions++;
                        p[i].wait_time_in_class = 0;
                        record_event(&r.trace, current_time, EVENT_AGING, p[i].pid, from, REAL_TIME, AGING_THRESHOLD, 0, "Promoted to Real-Time");
                    }
                }
            }
        }

        // Selection phase
        int next_idx = -1;
        int highest_priority = 9999;
        
        // 1. Real-Time (Priority)
        for (int i = 0; i < n; i++) {
            if (p[i].arrival_time <= current_time && p[i].remaining_time > 0 && p[i].current_class == REAL_TIME) {
                if (p[i].priority < highest_priority) {
                    highest_priority = p[i].priority;
                    next_idx = i;
                }
            }
        }

        // 2. Interactive (Round Robin)
        if (next_idx == -1) {
            // Check if current running process is interactive and its quantum hasn't expired yet
            if (running_idx != -1 && p[running_idx].remaining_time > 0 && p[running_idx].current_class == INTERACTIVE && quantum_used < current_quantum) {
                next_idx = running_idx;
            } else {
                // If quantum expired, record it
                if (running_idx != -1 && p[running_idx].remaining_time > 0 && p[running_idx].current_class == INTERACTIVE && quantum_used >= current_quantum) {
                    record_event(&r.trace, current_time, EVENT_QUANTUM_EXPIRE, p[running_idx].pid, 0, 0, 0, current_quantum, "Quantum expired");
                }
                
                int interactive_count = count_ready_interactive(p, n, current_time);
                if (interactive_count > 0) {
                    current_quantum = get_adaptive_quantum(interactive_count);
                    quantum_used = 0;
                    
                    for (int i = 1; i <= n; i++) {
                        int j = (last_interactive + i) % n;
                        if (p[j].arrival_time <= current_time && p[j].remaining_time > 0 && p[j].current_class == INTERACTIVE) {
                            next_idx = j;
                            last_interactive = j;
                            break;
                        }
                    }
                }
            }
        }

        // 3. Batch (SRTF)
        if (next_idx == -1) {
            int shortest = 9999;
            for (int i = 0; i < n; i++) {
                if (p[i].arrival_time <= current_time && p[i].remaining_time > 0 && p[i].current_class == BATCH) {
                    if (p[i].remaining_time < shortest) {
                        shortest = p[i].remaining_time;
                        next_idx = i;
                    }
                }
            }
        }

        // Handle context switch
        if (next_idx != running_idx) {
            if (running_idx != -1 && p[running_idx].remaining_time > 0) {
                if (p[running_idx].current_class != INTERACTIVE || next_idx != -1) { // We already logged quantum expire
                   if(p[running_idx].current_class != INTERACTIVE || quantum_used < current_quantum) {
                       record_event(&r.trace, current_time, EVENT_PREEMPTION, p[running_idx].pid, 0, 0, 0, 0, "Preempted");
                   }
                }
            }
            if (next_idx != -1) {
                int quantum = (p[next_idx].current_class == INTERACTIVE) ? current_quantum : 0;
                char reason[100];
                if (p[next_idx].current_class == REAL_TIME) sprintf(reason, "RT Priority %d", p[next_idx].priority);
                else if (p[next_idx].current_class == INTERACTIVE) sprintf(reason, "RR turn");
                else sprintf(reason, "SRTF %d left", p[next_idx].remaining_time);
                
                record_event(&r.trace, current_time, EVENT_DISPATCH, p[next_idx].pid, 0, 0, 0, quantum, reason);
                
                if (!p[next_idx].started) {
                    p[next_idx].response_time = current_time - p[next_idx].arrival_time;
                    p[next_idx].started = 1;
                }
                
                if (p[next_idx].current_class != INTERACTIVE) {
                    quantum_used = 0; // reset for non-RR just in case
                }
            } else {
                if (completed < n) {
                     // Check if previous was idle to avoid spam
                     if (r.trace.event_count == 0 || r.trace.events[r.trace.event_count - 1].type != EVENT_IDLE) {
                         record_event(&r.trace, current_time, EVENT_IDLE, 0, 0, 0, 0, 0, "Idle");
                     }
                }
            }
            running_idx = next_idx;
        }

        // Execute 1 unit of time
        if (running_idx != -1) {
            p[running_idx].remaining_time--;
            p[running_idx].wait_time_in_class = 0; // Reset wait time while running
            quantum_used++;
            busy_time++;
            if (r.total_time < MAX_TIME) r.timeline[r.total_time++] = p[running_idx].pid;
            current_time++;

            if (p[running_idx].remaining_time == 0) {
                completed++;
                p[running_idx].completion_time = current_time;
                p[running_idx].turnaround_time = current_time - p[running_idx].arrival_time;
                p[running_idx].waiting_time = p[running_idx].turnaround_time - p[running_idx].burst_time;
                
                record_event(&r.trace, current_time, EVENT_COMPLETION, p[running_idx].pid, 0, 0, 0, 0, "Completed");
                
                total_wt += p[running_idx].waiting_time;
                total_tat += p[running_idx].turnaround_time;
                total_rt += p[running_idx].response_time;
                running_idx = -1;
            }
        } else {
            if (r.total_time < MAX_TIME) r.timeline[r.total_time++] = 0;
            current_time++;
        }
    }

    r.avg_wt = total_wt / n;
    r.avg_tat = total_tat / n;
    r.avg_rt = total_rt / n;
    r.cpu_util = ((float)busy_time / current_time) * 100;
    
    return r;
}
