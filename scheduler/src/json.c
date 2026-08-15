#include <stdio.h>
#include "../include/scheduler.h"
#include "../include/json.h"

// Basic escape string function for JSON
static void escape_json_string(const char *src, char *dst) {
    while (*src) {
        if (*src == '"' || *src == '\\') {
            *dst++ = '\\';
        }
        *dst++ = *src++;
    }
    *dst = '\0';
}

static const char* event_type_to_string(EventType type) {
    switch (type) {
        case EVENT_ARRIVAL: return "ARRIVAL";
        case EVENT_DISPATCH: return "DISPATCH";
        case EVENT_PREEMPTION: return "PREEMPTION";
        case EVENT_QUANTUM_EXPIRE: return "QUANTUM_EXPIRE";
        case EVENT_AGING: return "AGING";
        case EVENT_PROMOTION: return "PROMOTION";
        case EVENT_COMPLETION: return "COMPLETION";
        case EVENT_IDLE: return "IDLE";
        default: return "UNKNOWN";
    }
}

static const char* process_type_to_string(int type) {
    switch (type) {
        case REAL_TIME: return "REAL_TIME";
        case INTERACTIVE: return "INTERACTIVE";
        case BATCH: return "BATCH";
        default: return "UNKNOWN";
    }
}

void print_json_output(struct Process processes[], int n, struct Result *r, int time_quantum, int aging_threshold, const char* algorithm) {
    printf("{\n");
    
    // Simulation info
    printf("  \"simulation\": {\n");
    printf("    \"algorithm\": \"%s\",\n", algorithm);
    printf("    \"timeQuantum\": %d,\n", time_quantum);
    printf("    \"agingThreshold\": %d,\n", aging_threshold);
    printf("    \"totalTime\": %d\n", r->total_time);
    printf("  },\n");

    // Processes info
    printf("  \"processes\": [\n");
    for (int i = 0; i < n; i++) {
        printf("    {\n");
        printf("      \"id\": %d,\n", processes[i].pid);
        printf("      \"arrivalTime\": %d,\n", processes[i].arrival_time);
        printf("      \"burstTime\": %d,\n", processes[i].burst_time);
        printf("      \"priority\": %d,\n", processes[i].priority);
        printf("      \"originalType\": \"%s\"\n", process_type_to_string(processes[i].original_type));
        printf("    }%s\n", (i == n - 1) ? "" : ",");
    }
    printf("  ],\n");

    // Timeline blocks
    printf("  \"timeline\": [\n");
    int block_start = 0;
    int current_pid = r->timeline[0];
    int first_block = 1;
    for (int t = 1; t <= r->total_time; t++) {
        if (t == r->total_time || r->timeline[t] != current_pid) {
            if (!first_block) printf(",\n");
            first_block = 0;
            printf("    {\n");
            printf("      \"start\": %d,\n", block_start);
            printf("      \"end\": %d,\n", t);
            printf("      \"processId\": %d\n", current_pid);
            printf("    }");
            if (t < r->total_time) {
                block_start = t;
                current_pid = r->timeline[t];
            }
        }
    }
    printf("\n  ],\n");

    // Trace events
    printf("  \"events\": [\n");
    for (int i = 0; i < r->trace.event_count; i++) {
        struct Event *e = &r->trace.events[i];
        char reason_esc[200] = {0};
        escape_json_string(e->reason, reason_esc);
        
        printf("    {\n");
        printf("      \"time\": %d,\n", e->time);
        printf("      \"type\": \"%s\",\n", event_type_to_string(e->type));
        printf("      \"processId\": %d", e->process_id);
        
        if (e->reason[0] != '\0') {
            printf(",\n      \"reason\": \"%s\"", reason_esc);
        }
        
        int has_details = (e->type == EVENT_AGING || e->type == EVENT_PROMOTION || e->type == EVENT_DISPATCH || e->type == EVENT_QUANTUM_EXPIRE);
        if (has_details) {
            printf(",\n      \"details\": {");
            int first_detail = 1;
            if (e->type == EVENT_AGING || e->type == EVENT_PROMOTION) {
                printf("\n        \"fromType\": \"%s\",\n", process_type_to_string(e->from_type));
                printf("        \"toType\": \"%s\",\n", process_type_to_string(e->to_type));
                printf("        \"waitingTime\": %d", e->waiting_time);
                first_detail = 0;
            }
            if (e->type == EVENT_DISPATCH || e->type == EVENT_QUANTUM_EXPIRE) {
                if (!first_detail) printf(",");
                printf("\n        \"quantum\": %d", e->quantum);
            }
            printf("\n      }");
        }
        printf("\n    }%s\n", (i == r->trace.event_count - 1) ? "" : ",");
    }
    printf("  ],\n");

    // Metrics
    printf("  \"metrics\": {\n");
    printf("    \"averageWaitingTime\": %.2f,\n", r->avg_wt);
    printf("    \"averageTurnaroundTime\": %.2f,\n", r->avg_tat);
    printf("    \"averageResponseTime\": %.2f,\n", r->avg_rt);
    printf("    \"cpuUtilization\": %.2f,\n", r->cpu_util);
    printf("    \"contextSwitches\": %d\n", r->context_switches);
    printf("  },\n");

    // Process metrics
    printf("  \"processMetrics\": [\n");
    for (int i = 0; i < n; i++) {
        printf("    {\n");
        printf("      \"processId\": %d,\n", processes[i].pid);
        printf("      \"completionTime\": %d,\n", processes[i].completion_time);
        printf("      \"turnaroundTime\": %d,\n", processes[i].turnaround_time);
        printf("      \"waitingTime\": %d,\n", processes[i].waiting_time);
        printf("      \"responseTime\": %d\n", processes[i].response_time);
        printf("    }%s\n", (i == n - 1) ? "" : ",");
    }
    printf("  ]\n");
    printf("}\n");
}
