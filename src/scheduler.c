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

        printf("Priority (Lower number = Higher priority): ");
        scanf("%d", &p[i].priority);

        printf("Type (1 = Real-Time, 2 = Interactive, 3 = Batch): ");
        scanf("%d", &p[i].type);

        p[i].remaining_time = p[i].burst_time;
        p[i].completion_time = 0;
        p[i].waiting_time = 0;
        p[i].turnaround_time = 0;
    }
}

void display_processes(struct Process p[], int n) {
    printf("\n\nProcess Table:\n");
    printf("PID\tAT\tBT\tPR\tTYPE\n");

    for (int i = 0; i < n; i++) {
        printf("%d\t%d\t%d\t%d\t%d\n",
               p[i].pid,
               p[i].arrival_time,
               p[i].burst_time,
               p[i].priority,
               p[i].type);
    }
}
void fcfs(struct Process p[], int n) {
    int current_time = 0;

    for (int i = 0; i < n; i++) {

        // If CPU is idle
        if (current_time < p[i].arrival_time) {
            current_time = p[i].arrival_time;
        }

        current_time += p[i].burst_time;

        p[i].completion_time = current_time;
        p[i].turnaround_time = p[i].completion_time - p[i].arrival_time;
        p[i].waiting_time = p[i].turnaround_time - p[i].burst_time;
    }
}
void calculate_metrics(struct Process p[], int n) {
    float total_wt = 0, total_tat = 0;

    printf("\nFCFS Scheduling Results:\n");
    printf("PID\tCT\tTAT\tWT\n");

    for (int i = 0; i < n; i++) {
        printf("%d\t%d\t%d\t%d\n",
               p[i].pid,
               p[i].completion_time,
               p[i].turnaround_time,
               p[i].waiting_time);

        total_wt += p[i].waiting_time;
        total_tat += p[i].turnaround_time;
    }

    printf("\nAverage Waiting Time: %.2f\n", total_wt / n);
    printf("Average Turnaround Time: %.2f\n", total_tat / n);
}

int main() {
    struct Process processes[MAX_PROCESSES];
    int n;

    input_processes(processes, &n);

    fcfs(processes, n);
    calculate_metrics(processes, n);

    return 0;
}

