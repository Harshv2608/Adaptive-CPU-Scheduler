#include <stdio.h>
#include "scheduler.h"

void input_processes(struct Process p[], int *n) {
    printf("Enter number of processes: ");
    scanf("%d", n);

    for (int i = 0; i < *n; i++) {
        p[i].pid = i + 1;

        printf("\nProcess %d\n", p[i].pid);

        printf("Arrival Time: ");
        scanf("%d", &p[i].arrival_time);

        printf("Burst Time: ");
        scanf("%d", &p[i].burst_time);

        printf("Priority (Lower = Higher priority): ");
        scanf("%d", &p[i].priority);

        printf("Type (1=RT, 2=Interactive, 3=Batch): ");
        scanf("%d", &p[i].type);

        p[i].remaining_time = p[i].burst_time;
        p[i].completion_time = 0;
        p[i].waiting_time = 0;
        p[i].turnaround_time = 0;
        p[i].response_time = -1;
        p[i].started = 0;
    }
}

void copy_processes(struct Process src[], struct Process dest[], int n) {
    for (int i = 0; i < n; i++)
        dest[i] = src[i];
}

struct Result hybrid_scheduler(struct Process p[], int n, int quantum) {

    int current_time = 0, completed = 0, last_interactive = -1;
    int timeline[MAX_TIME];
    int busy_time = 0;
    float total_wt = 0, total_tat = 0;

    while (completed < n) {

        if (current_time > 0 && current_time % 5 == 0) {
            for (int i = 0; i < n; i++) {
                if (p[i].arrival_time <= current_time &&
                    p[i].remaining_time > 0 &&
                    p[i].type != REAL_TIME &&
                    p[i].priority > 1) {
                    p[i].priority--;
                }
            }
        }

        int index = -1;
        int highest_priority = 9999;

        for (int i = 0; i < n; i++) {
            if (p[i].arrival_time <= current_time &&
                p[i].remaining_time > 0 &&
                p[i].type == REAL_TIME &&
                p[i].priority < highest_priority) {
                highest_priority = p[i].priority;
                index = i;
            }
        }

        if (index == -1) {
            for (int i = 1; i <= n; i++) {
                int j = (last_interactive + i) % n;
                if (p[j].arrival_time <= current_time &&
                    p[j].remaining_time > 0 &&
                    p[j].type == INTERACTIVE) {
                    index = j;
                    last_interactive = j;
                    break;
                }
            }

            if (index != -1) {
                if (!p[index].started) {
                    p[index].response_time =
                        current_time - p[index].arrival_time;
                    p[index].started = 1;
                }

                int slice = p[index].remaining_time < quantum ?
                            p[index].remaining_time : quantum;

                for (int t = 0; t < slice; t++) {
                    timeline[current_time] = p[index].pid;
                    p[index].remaining_time--;
                    current_time++;
                    busy_time++;
                }

                if (p[index].remaining_time == 0) {
                    completed++;
                    p[index].completion_time = current_time;
                    p[index].turnaround_time =
                        current_time - p[index].arrival_time;
                    p[index].waiting_time =
                        p[index].turnaround_time - p[index].burst_time;

                    total_wt += p[index].waiting_time;
                    total_tat += p[index].turnaround_time;
                }
                continue;
            }
        }

        if (index == -1) {
            int shortest = 9999;
            for (int i = 0; i < n; i++) {
                if (p[i].arrival_time <= current_time &&
                    p[i].remaining_time > 0 &&
                    p[i].type == BATCH &&
                    p[i].remaining_time < shortest) {
                    shortest = p[i].remaining_time;
                    index = i;
                }
            }
        }

        if (index == -1) {
            timeline[current_time] = 0;
            current_time++;
            continue;
        }

        if (!p[index].started) {
            p[index].response_time =
                current_time - p[index].arrival_time;
            p[index].started = 1;
        }

        timeline[current_time] = p[index].pid;
        p[index].remaining_time--;
        current_time++;
        busy_time++;

        if (p[index].remaining_time == 0) {
            completed++;
            p[index].completion_time = current_time;
            p[index].turnaround_time =
                current_time - p[index].arrival_time;
            p[index].waiting_time =
                p[index].turnaround_time - p[index].burst_time;

            total_wt += p[index].waiting_time;
            total_tat += p[index].turnaround_time;
        }
    }

    print_gantt(timeline, current_time);

    struct Result r;
    r.avg_wt = total_wt / n;
    r.avg_tat = total_tat / n;
    r.cpu_util = ((float)busy_time / current_time) * 100;

    return r;
}

struct Result fcfs_scheduler(struct Process p[], int n) {

    int time = 0;
    float total_wt = 0, total_tat = 0;

    for (int i = 0; i < n; i++) {
        if (time < p[i].arrival_time)
            time = p[i].arrival_time;

        p[i].completion_time = time + p[i].burst_time;
        p[i].turnaround_time =
            p[i].completion_time - p[i].arrival_time;
        p[i].waiting_time =
            p[i].turnaround_time - p[i].burst_time;

        time = p[i].completion_time;

        total_wt += p[i].waiting_time;
        total_tat += p[i].turnaround_time;
    }

    struct Result r = { total_wt / n, total_tat / n, 100.0 };
    return r;
}

struct Result sjf_scheduler(struct Process p[], int n) {

    int completed = 0, time = 0;
    float total_wt = 0, total_tat = 0;

    while (completed < n) {
        int index = -1, shortest = 9999;

        for (int i = 0; i < n; i++) {
            if (p[i].arrival_time <= time &&
                p[i].remaining_time > 0 &&
                p[i].burst_time < shortest) {
                shortest = p[i].burst_time;
                index = i;
            }
        }

        if (index == -1) { time++; continue; }

        time += p[index].burst_time;

        p[index].completion_time = time;
        p[index].turnaround_time =
            time - p[index].arrival_time;
        p[index].waiting_time =
            p[index].turnaround_time - p[index].burst_time;

        p[index].remaining_time = 0;
        completed++;

        total_wt += p[index].waiting_time;
        total_tat += p[index].turnaround_time;
    }

    struct Result r = { total_wt / n, total_tat / n, 100.0 };
    return r;
}

struct Result priority_scheduler(struct Process p[], int n) {

    int completed = 0, time = 0;
    float total_wt = 0, total_tat = 0;

    while (completed < n) {
        int index = -1, highest = 9999;

        for (int i = 0; i < n; i++) {
            if (p[i].arrival_time <= time &&
                p[i].remaining_time > 0 &&
                p[i].priority < highest) {
                highest = p[i].priority;
                index = i;
            }
        }

        if (index == -1) { time++; continue; }

        time += p[index].burst_time;

        p[index].completion_time = time;
        p[index].turnaround_time =
            time - p[index].arrival_time;
        p[index].waiting_time =
            p[index].turnaround_time - p[index].burst_time;

        p[index].remaining_time = 0;
        completed++;

        total_wt += p[index].waiting_time;
        total_tat += p[index].turnaround_time;
    }

    struct Result r = { total_wt / n, total_tat / n, 100.0 };
    return r;
}

struct Result round_robin_scheduler(struct Process p[], int n, int quantum) {

    int completed = 0, time = 0;
    float total_wt = 0, total_tat = 0;

    while (completed < n) {
        int done = 1;

        for (int i = 0; i < n; i++) {
            if (p[i].remaining_time > 0 &&
                p[i].arrival_time <= time) {

                done = 0;

                if (p[i].remaining_time > quantum) {
                    time += quantum;
                    p[i].remaining_time -= quantum;
                } else {
                    time += p[i].remaining_time;
                    p[i].remaining_time = 0;

                    p[i].completion_time = time;
                    p[i].turnaround_time =
                        time - p[i].arrival_time;
                    p[i].waiting_time =
                        p[i].turnaround_time - p[i].burst_time;

                    total_wt += p[i].waiting_time;
                    total_tat += p[i].turnaround_time;
                    completed++;
                }
            }
        }
        if (done) time++;
    }

    struct Result r = { total_wt / n, total_tat / n, 100.0 };
    return r;
}

void print_comparison(struct Result h,
                      struct Result f,
                      struct Result s,
                      struct Result p,
                      struct Result r) {

    printf("\n\n============================================================\n");
    printf("                PERFORMANCE COMPARISON\n");
    printf("============================================================\n");
    printf("%-15s %-12s %-12s %-12s\n",
           "Algorithm", "Avg WT", "Avg TAT", "CPU Util (%)");
    printf("------------------------------------------------------------\n");

    printf("%-15s %-12.2f %-12.2f %-12.2f\n",
           "Hybrid", h.avg_wt, h.avg_tat, h.cpu_util);

    printf("%-15s %-12.2f %-12.2f %-12.2f\n",
           "FCFS", f.avg_wt, f.avg_tat, f.cpu_util);

    printf("%-15s %-12.2f %-12.2f %-12.2f\n",
           "SJF", s.avg_wt, s.avg_tat, s.cpu_util);

    printf("%-15s %-12.2f %-12.2f %-12.2f\n",
           "Priority", p.avg_wt, p.avg_tat, p.cpu_util);

    printf("%-15s %-12.2f %-12.2f %-12.2f\n",
           "Round Robin", r.avg_wt, r.avg_tat, r.cpu_util);

    printf("============================================================\n");
}
void print_gantt(int timeline[], int length) {
    printf("\nGantt Chart:\n|");

    for (int i = 0; i < length; i++) {
        if (timeline[i] != -1)
            printf(" P%d |", timeline[i]);
        else
            printf(" Idle |");
    }

    printf("\n0");

    for (int i = 1; i <= length; i++) {
        printf("    %d", i);
    }

    printf("\n");
}


int main() {

    struct Process original[MAX_PROCESSES];
    struct Process temp[MAX_PROCESSES];

    struct Result r_h, r_f, r_s, r_p, r_rr;

    int n;
    int quantum = 2;

    input_processes(original, &n);

    copy_processes(original, temp, n);
    r_h = hybrid_scheduler(temp, n, quantum);

    copy_processes(original, temp, n);
    r_f = fcfs_scheduler(temp, n);

    copy_processes(original, temp, n);
    r_s = sjf_scheduler(temp, n);

    copy_processes(original, temp, n);
    r_p = priority_scheduler(temp, n);

    copy_processes(original, temp, n);
    r_rr = round_robin_scheduler(temp, n, quantum);

    print_comparison(r_h, r_f, r_s, r_p, r_rr);

    return 0;
}
