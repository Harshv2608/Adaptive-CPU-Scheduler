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
void round_robin(struct Process p[], int n, int quantum) {

    int current_time = 0;
    int completed = 0;
    int queue[MAX_PROCESSES];
    int front = 0, rear = 0;

    // Reset remaining time
    for (int i = 0; i < n; i++) {
        p[i].remaining_time = p[i].burst_time;
    }

    // Add processes that arrive at time 0
    for (int i = 0; i < n; i++) {
        if (p[i].arrival_time == 0) {
            queue[rear++] = i;
        }
    }

    while (completed < n) {

        if (front == rear) {
            current_time++;
            for (int i = 0; i < n; i++) {
                if (p[i].arrival_time == current_time) {
                    queue[rear++] = i;
                }
            }
            continue;
        }

        int index = queue[front++];
        
        if (p[index].remaining_time > quantum) {
            current_time += quantum;
            p[index].remaining_time -= quantum;
        } else {
            current_time += p[index].remaining_time;
            p[index].remaining_time = 0;
            completed++;

            p[index].completion_time = current_time;
            p[index].turnaround_time = current_time - p[index].arrival_time;
            p[index].waiting_time = p[index].turnaround_time - p[index].burst_time;
        }

        // Add newly arrived processes
        for (int i = 0; i < n; i++) {
            if (p[i].arrival_time > current_time - quantum &&
                p[i].arrival_time <= current_time) {
                queue[rear++] = i;
            }
        }

        // If not finished, add back to queue
        if (p[index].remaining_time > 0) {
            queue[rear++] = index;
        }
    }
}
void priority_preemptive(struct Process p[], int n) {

    int current_time = 0;
    int completed = 0;
    int is_completed[MAX_PROCESSES] = {0};

    while (completed < n) {

        int highest_priority = 9999;
        int index = -1;

        for (int i = 0; i < n; i++) {
            if (p[i].arrival_time <= current_time &&
                !is_completed[i] &&
                p[i].remaining_time > 0) {

                if (p[i].priority < highest_priority) {
                    highest_priority = p[i].priority;
                    index = i;
                }
            }
        }

        if (index == -1) {
            current_time++;
            continue;
        }

        p[index].remaining_time--;
        current_time++;

        if (p[index].remaining_time == 0) {
            completed++;
            is_completed[index] = 1;

            p[index].completion_time = current_time;
            p[index].turnaround_time =
                p[index].completion_time - p[index].arrival_time;
            p[index].waiting_time =
                p[index].turnaround_time - p[index].burst_time;
        }
    }
}
void hybrid_scheduler(struct Process p[], int n, int quantum) {

    int current_time = 0;
    int completed = 0;
    int rr_counter = 0;   // Track quantum usage
    int last_rr_index = -1;

    while (completed < n) {

        int index = -1;

        // -------------------------
        // 1️⃣ Check Real-Time Processes
        // -------------------------
        int highest_priority = 9999;

        for (int i = 0; i < n; i++) {
            if (p[i].arrival_time <= current_time &&
                p[i].remaining_time > 0 &&
                p[i].type == REAL_TIME) {

                if (p[i].priority < highest_priority) {
                    highest_priority = p[i].priority;
                    index = i;
                }
            }
        }

        // -------------------------
        // 2️⃣ If no Real-Time, check Interactive (Round Robin)
        // -------------------------
        if (index == -1) {

            for (int i = 0; i < n; i++) {
                if (p[i].arrival_time <= current_time &&
                    p[i].remaining_time > 0 &&
                    p[i].type == INTERACTIVE) {

                    index = i;
                    break;
                }
            }

            if (index != -1) {

                if (last_rr_index == index)
                    rr_counter++;
                else {
                    rr_counter = 1;
                    last_rr_index = index;
                }

                if (rr_counter > quantum) {
                    rr_counter = 1;
                }
            }
        }

        // -------------------------
        // 3️⃣ If no Interactive, check Batch (SJF style)
        // -------------------------
        if (index == -1) {

            int shortest_time = 9999;

            for (int i = 0; i < n; i++) {
                if (p[i].arrival_time <= current_time &&
                    p[i].remaining_time > 0 &&
                    p[i].type == BATCH) {

                    if (p[i].remaining_time < shortest_time) {
                        shortest_time = p[i].remaining_time;
                        index = i;
                    }
                }
            }
        }

        // -------------------------
        // 4️⃣ If no process available
        // -------------------------
        if (index == -1) {
            current_time++;
            continue;
        }

        // Execute selected process
        p[index].remaining_time--;
        current_time++;

        // If completed
        if (p[index].remaining_time == 0) {
            completed++;
            p[index].completion_time = current_time;
            p[index].turnaround_time =
                current_time - p[index].arrival_time;
            p[index].waiting_time =
                p[index].turnaround_time - p[index].burst_time;
        }
    }
}

int main() {
    struct Process processes[MAX_PROCESSES];
    int n;
    int quantum = 2;

    input_processes(processes, &n);

    for (int i = 0; i < n; i++)
        processes[i].remaining_time = processes[i].burst_time;

    hybrid_scheduler(processes, n, quantum);
    calculate_metrics(processes, n);

    return 0;
}
