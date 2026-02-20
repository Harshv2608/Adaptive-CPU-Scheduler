# 🖥️ Adaptive Hybrid CPU Scheduler in C

![C](https://img.shields.io/badge/Language-C-blue)
![Algorithm](https://img.shields.io/badge/Scheduling-Hybrid-success)
![Status](https://img.shields.io/badge/Project-Completed-brightgreen)
![License](https://img.shields.io/badge/License-Academic-lightgrey)

An implementation of an **Adaptive Hybrid CPU Scheduling Algorithm** in C that intelligently schedules processes based on their type.

This project combines multiple classical CPU scheduling algorithms into a single optimized hybrid scheduler and compares its performance with traditional scheduling techniques.

---

## 📌 Project Overview

The scheduler dynamically selects scheduling strategies based on process classification:

- 🔴 **Real-Time Processes** → Preemptive Priority Scheduling  
- 🟢 **Interactive Processes** → Round Robin Scheduling  
- 🔵 **Batch Processes** → Shortest Remaining Time First (SRTF)  

The goal is to reduce waiting time, improve turnaround time, and prevent starvation while maintaining fairness.

---

## 🎯 Objectives

- Implement a hybrid scheduling strategy  
- Reduce average waiting time  
- Improve turnaround time  
- Prevent starvation using aging  
- Compare performance with:
  - FCFS  
  - SJF  
  - Priority Scheduling  
  - Round Robin  

---

## 🧠 Scheduling Strategy

### 1️⃣ Real-Time Processes
- Highest priority  
- Preemptive Priority Scheduling  
- Lower priority value = Higher priority  

### 2️⃣ Interactive Processes
- Scheduled using Round Robin  
- Fixed Time Quantum (default = 2)  

### 3️⃣ Batch Processes
- Scheduled using Shortest Remaining Time First (SRTF)  
- Optimizes average waiting time  

---

## ⚙️ Features

- Hybrid multi-level scheduling  
- Gantt chart generation  
- Performance comparison table  
- CPU utilization calculation  
- Waiting & turnaround time metrics  
- Starvation prevention (aging mechanism)  
- Modular code using header file  
- Clean CLI interface  

---

## 📂 Project Structure

    Adaptive-CPU-Scheduler/
    │
    ├── src/
    │   ├── scheduler.c
    │   └── scheduler.h
    │
    └── README.md

---

## 🛠️ Compilation & Execution

### Compile

    gcc src/scheduler.c -o scheduler

### Run (Linux / macOS)

    ./scheduler

### Run (Windows PowerShell)

    ./scheduler

---

## 🧪 Sample Input

    Enter number of processes: 4

    Process 1
    Arrival Time: 0
    Burst Time: 5
    Priority: 2
    Type: 1

    Process 2
    Arrival Time: 1
    Burst Time: 3
    Priority: 3
    Type: 2

    Process 3
    Arrival Time: 2
    Burst Time: 4
    Priority: 4
    Type: 3

    Process 4
    Arrival Time: 3
    Burst Time: 2
    Priority: 5
    Type: 2

---

## 📊 Sample Output

### Gantt Chart

    | P1 | P1 | P1 | P1 | P1 | P2 | P2 | P4 | P4 | P2 | P3 | P3 | P3 | P3 |

### Performance Comparison

    ============================================================
                    PERFORMANCE COMPARISON
    ============================================================
    Algorithm       Avg WT       Avg TAT      CPU Util (%)
    ------------------------------------------------------------
    Hybrid          4.50         8.00         100.00
    FCFS            4.75         8.25         100.00
    SJF             4.00         7.50         100.00
    Priority        4.75         8.25         100.00
    Round Robin     6.50         10.00        100.00
    ============================================================

---

## 📈 Metrics Calculated

For each process:
- Completion Time (CT)  
- Turnaround Time (TAT)  
- Waiting Time (WT)  
- Response Time  

Overall:
- Average Waiting Time  
- Average Turnaround Time  
- CPU Utilization (%)  

---

## 📚 Algorithms Implemented

| Algorithm     | Type           | Purpose                       |
|---------------|---------------|-------------------------------|
| FCFS          | Non-preemptive| Baseline comparison           |
| SJF           | Non-preemptive| Minimize waiting time         |
| Priority      | Preemptive    | Real-time support             |
| Round Robin   | Preemptive    | Fair time-sharing             |
| Hybrid        | Adaptive      | Intelligent combined approach |

---

## 🏆 Advantages of Hybrid Scheduler

- Efficient handling of mixed workloads  
- Reduced starvation  
- Improved responsiveness  
- Balanced fairness and performance  
- Practical approach for modern OS environments  

---

## 🔍 Key Concepts Demonstrated

- CPU Scheduling  
- Preemption  
- Time Quantum  
- Aging  
- Gantt Chart Visualization  
- Performance Benchmarking  
- Modular C Programming  

---

## 🚀 Future Improvements

- Dynamic quantum adjustment  
- Multi-core scheduling support  
- GUI visualization  
- Graph plotting for metrics  
- File-based input system  
- Priority aging visualization  

---

## 👨‍💻 Author

Harsh Vardhan  
Adaptive Hybrid CPU Scheduler in C  

---

## 📄 License

This project is developed for academic and educational purposes.
