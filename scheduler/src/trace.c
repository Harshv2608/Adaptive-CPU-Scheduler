#include <string.h>
#include "../include/trace.h"

void init_trace(struct Trace *trace) {
    trace->event_count = 0;
}

void record_event(struct Trace *trace, int time, EventType type, int process_id, int from_type, int to_type, int waiting_time, int quantum, const char *reason) {
    if (trace->event_count >= MAX_EVENTS) return;
    
    struct Event *e = &trace->events[trace->event_count++];
    e->time = time;
    e->type = type;
    e->process_id = process_id;
    e->from_type = from_type;
    e->to_type = to_type;
    e->waiting_time = waiting_time;
    e->quantum = quantum;
    if (reason != NULL) {
        strncpy(e->reason, reason, sizeof(e->reason) - 1);
        e->reason[sizeof(e->reason) - 1] = '\0';
    } else {
        e->reason[0] = '\0';
    }
}
