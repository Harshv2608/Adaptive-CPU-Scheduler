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

int main() {
    struct Process processes[MAX_PROCESSES];
    int n;

    input_processes(processes, &n);
    display_processes(processes, n);

    return 0;
}
