# SchedX: Interactive CPU Scheduling Simulator

SchedX is an interactive, web-based CPU Scheduling Simulator. At its core, it executes mathematical scheduling algorithms in C and visualizes the results on a modern, responsive web dashboard built with Next.js.

## 🚀 Live Demo Architecture

```text
                    ┌─────────────────────────┐
                    │       Web Frontend      │
                    │                         │
                    │ React / Next.js         │
                    │ Interactive Dashboard   │
                    │ Gantt Visualization     │
                    │ Metrics & Charts        │
                    └───────────┬─────────────┘
                                │
                      HTTP JSON Trace
                                │
                    ┌───────────▼─────────────┐
                    │       Express API       │
                    │                         │
                    │ Node.js Backend         │
                    │ Trace Validation        │
                    │ Spawn/Exec Controller   │
                    └───────────┬─────────────┘
                                │
                       JSON Data Pipes
                                │
                    ┌───────────▼─────────────┐
                    │       C Engine          │
                    │                         │
                    │ High-Performance        │
                    │ Core Simulation         │
                    │ Math Invariants         │
                    └─────────────────────────┘
```

## ✨ Features

- **5 Scheduling Algorithms**: Supports `FCFS`, `SJF (Non-preemptive)`, `Priority (Preemptive)`, `Round Robin`, and `Adaptive Hybrid`.
- **High Performance Core**: C engine execution generates trace metrics and timelines at native speeds.
- **Explainable Decisions**: Real-time event log trace explains *why* processes were promoted, preempted, or aging in the `Hybrid` algorithm.
- **Comparison Engine**: Run `Benchmarks` dashboard to spawn 5 concurrent instances of the engine to compare all algorithms side-by-side using identically seeded workloads.
- **Metrics**: Turnaround Time, Waiting Time, Response Time, CPU Utilization, and Context Switches.

## ⚙️ The Adaptive Hybrid Scheduler

This project introduces a custom `HYBRID` scheduler combining Priority, Round Robin, and Shortest Remaining Time First (SRTF), governed by an **Aging** mechanism.

- **Real-Time Queue**: Executed based on Priority.
- **Interactive Queue**: Executed via Round Robin with an **Adaptive Quantum** based on system load.
- **Batch Queue**: Executed via Shortest Remaining Time First (SRTF).

### Aging Mechanism
If a `BATCH` process starves (waiting time exceeds `Aging Threshold`), it is dynamically promoted to `INTERACTIVE`. If it starves again, it is promoted to `REAL_TIME`.

## 🛠 Installation & Usage

Requires `Node.js 18+`, `Python 3`, and a `C compiler (gcc)`.

1. **Compile the Engine**
```bash
cd scheduler
make
```

2. **Start the Backend**
```bash
cd backend
npm install
npm run start
```

3. **Start the Frontend**
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000` in your browser.

## 🧪 Testing and CI/CD

SchedX has a rigorous test suite enforcing mathematical invariants.

**Run C Engine Tests (Python unittests)**
```bash
cd scheduler
python -m unittest discover tests
```

**Run Backend API Tests (Jest)**
```bash
cd backend
npm test
```

Memory safety is checked via AddressSanitizer (`make asan`). The repository uses GitHub Actions for automated CI pipelines.
