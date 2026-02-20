#ifndef SCHEDULER_H
#define SCHEDULER_H

#define MAX_PROCESSES 50
#define MAX_TIME 1000

/* Process Types */
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
    int response_time;
    int started;
};

void input_processes(struct Process p[], int *n);
void hybrid_scheduler(struct Process p[], int n, int quantum);
void calculate_metrics(struct Process p[], int n);
void print_gantt(int timeline[], int length);

#endif
