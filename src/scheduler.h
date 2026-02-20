#ifndef SCHEDULER_H
#define SCHEDULER_H

#define MAX_PROCESSES 50

// Process Types
#define REAL_TIME 1
#define INTERACTIVE 2
#define BATCH 3

struct Process {
    int pid;
    int arrival_time;
    int burst_time;
    int remaining_time;
    int priority;
    int type;
    int completion_time;
    int waiting_time;
    int turnaround_time;
};

void input_processes(struct Process p[], int *n);
void display_processes(struct Process p[], int n);

#endif
