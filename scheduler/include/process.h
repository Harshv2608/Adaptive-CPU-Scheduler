#ifndef PROCESS_H
#define PROCESS_H

#define MAX_PROCESSES 1000

#define REAL_TIME 1
#define INTERACTIVE 2
#define BATCH 3

struct Process {
    int pid;
    int arrival_time;
    int burst_time;
    int remaining_time;
    int priority;         // Original priority
    
    int original_type;    // REAL_TIME, INTERACTIVE, or BATCH
    int current_class;    // Effective class (can change due to aging)
    
    int wait_time_in_class; // How long it has waited since last execution or promotion
    int promotions;       // Number of times promoted

    // Metrics
    int completion_time;
    int waiting_time;
    int turnaround_time;
    int response_time;
    
    // Internal flags
    int started;
};

#endif
