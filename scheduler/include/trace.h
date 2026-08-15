#ifndef TRACE_H
#define TRACE_H

#define MAX_EVENTS 500

typedef enum {
    EVENT_ARRIVAL,
    EVENT_DISPATCH,
    EVENT_PREEMPTION,
    EVENT_QUANTUM_EXPIRE,
    EVENT_AGING,
    EVENT_PROMOTION,
    EVENT_COMPLETION,
    EVENT_IDLE
} EventType;

struct Event {
    int time;
    EventType type;
    int process_id;
    int from_type;     // For PROMOTION
    int to_type;       // For PROMOTION
    int waiting_time;  // For PROMOTION
    int quantum;       // For DISPATCH (Adaptive quantum)
    char reason[100];  // Optional reason string
};

struct Trace {
    struct Event events[MAX_EVENTS];
    int event_count;
};

void init_trace(struct Trace *trace);
void record_event(struct Trace *trace, int time, EventType type, int process_id, int from_type, int to_type, int waiting_time, int quantum, const char *reason);

#endif
