#ifndef SCHEDULER_H
#define SCHEDULER_H

#define MAX_PROCESSES 50
#define MAX_TIME 1000

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

struct Result {
    float avg_wt;
    float avg_tat;
    float cpu_util;
};

void input_processes(struct Process p[], int *n);
void copy_processes(struct Process src[], struct Process dest[], int n);

struct Result hybrid_scheduler(struct Process p[], int n, int quantum);
struct Result fcfs_scheduler(struct Process p[], int n);
struct Result sjf_scheduler(struct Process p[], int n);
struct Result priority_scheduler(struct Process p[], int n);
struct Result round_robin_scheduler(struct Process p[], int n, int quantum);

void print_gantt(int timeline[], int length);
void print_comparison(struct Result h,
                      struct Result f,
                      struct Result s,
                      struct Result p,
                      struct Result r);

#endif
