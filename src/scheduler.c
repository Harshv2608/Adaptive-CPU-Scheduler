#include <stdio.h>
#include "scheduler.h"

/* ===============================
   INPUT FUNCTION
================================ */

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

/* ===============================
   HYBRID SCHEDULER
================================ */

void hybrid_scheduler(struct Process p[], int n, int quantum) {

    int current_time = 0;
    int completed = 0;
    int last_interactive = -1;

    int timeline[MAX_TIME];

    while (completed < n) {

        int index = -1;

        /* ==========================
           1️⃣ REAL-TIME → Priority Preemptive
        ========================== */

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

        /* ==========================
           2️⃣ INTERACTIVE → Round Robin
        ========================== */

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

                int slice = (p[index].remaining_time < quantum)
                            ? p[index].remaining_time
                            : quantum;

                for (int t = 0; t < slice; t++) {
                    timeline[current_time] = p[index].pid;
                    p[index].remaining_time--;
                    current_time++;
                }

                if (p[index].remaining_time == 0) {
                    completed++;
                    p[index].completion_time = current_time;
                    p[index].turnaround_time =
                        current_time - p[index].arrival_time;
                    p[index].waiting_time =
                        p[index].turnaround_time - p[index].burst_time;
                }

                continue;
            }
        }

        /* ==========================
           3️⃣ BATCH → SRTF
        ========================== */

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

        /* ==========================
           CPU IDLE
        ========================== */

        if (index == -1) {
            timeline[current_time] = 0;  // idle
            current_time++;
            continue;
        }

        /* ==========================
           Execute 1 unit (RT or Batch)
        ========================== */

        if (!p[index].started) {
            p[index].response_time =
                current_time - p[index].arrival_time;
            p[index].started = 1;
        }

        timeline[current_time] = p[index].pid;
        p[index].remaining_time--;
        current_time++;

        if (p[index].remaining_time == 0) {
            completed++;
            p[index].completion_time = current_time;
            p[index].turnaround_time =
                current_time - p[index].arrival_time;
            p[index].waiting_time =
                p[index].turnaround_time - p[index].burst_time;
        }
    }

    print_gantt(timeline, current_time);
}

/* ===============================
   METRICS
================================ */

void calculate_metrics(struct Process p[], int n) {

    float total_wt = 0, total_tat = 0, total_rt = 0;

    printf("\nPID\tCT\tTAT\tWT\tRT\n");

    for (int i = 0; i < n; i++) {

        printf("%d\t%d\t%d\t%d\t%d\n",
               p[i].pid,
               p[i].completion_time,
               p[i].turnaround_time,
               p[i].waiting_time,
               p[i].response_time);

        total_wt += p[i].waiting_time;
        total_tat += p[i].turnaround_time;
        total_rt += p[i].response_time;
    }

    printf("\nAverage Waiting Time: %.2f", total_wt / n);
    printf("\nAverage Turnaround Time: %.2f", total_tat / n);
    printf("Average Response Time: %.2f\n", total_rt / n);
}

/* ===============================
   GANTT CHART
================================ */

void print_gantt(int timeline[], int length) {

    printf("\n\nGantt Chart:\n|");

    int prev = -1;

    for (int i = 0; i < length; i++) {
        if (timeline[i] != prev) {
            if (timeline[i] == 0)
                printf(" Idle |");
            else
                printf(" P%d |", timeline[i]);
            prev = timeline[i];
        }
    }

    printf("\n0");

    prev = timeline[0];

    for (int i = 1; i < length; i++) {
        if (timeline[i] != prev) {
            printf("    %d", i);
            prev = timeline[i];
        }
    }

    printf("    %d\n", length);
}

/* ===============================
   MAIN
================================ */

int main() {

    struct Process processes[MAX_PROCESSES];
    int n;
    int quantum = 2;

    input_processes(processes, &n);

    hybrid_scheduler(processes, n, quantum);

    calculate_metrics(processes, n);

    return 0;
}
