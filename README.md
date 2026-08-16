# SchedX: Interactive CPU Scheduling Simulator

SchedX is a high-performance, interactive CPU Scheduling Simulator. At its core, it executes complex scheduling algorithms natively in C, validates mathematical invariants via a Node.js Express API, and visualizes the process execution trace in a modern Next.js dashboard. 

**[Live Demo](#) | [Documentation](#) | [Architecture](#)**

*(Insert Landing Page Screenshot Here)*

## Architecture Pipeline

The application relies on a strict separation of concerns, enforcing the invariant that **C decides, JSON records, and React visualizes**.

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
    HTTP JSON Trace Data
              │
  ┌───────────▼─────────────┐
  │       Express API       │
  │                         │
  │ Node.js Backend         │
  │ Trace Validation        │
  │ Spawn/Exec Controller   │
  └───────────┬─────────────┘
              │
    Standard I/O Data Pipes
              │
  ┌───────────▼─────────────┐
  │       C Engine          │
  │                         │
  │ High-Performance        │
  │ Core Simulation         │
  │ Math Invariants         │
  └─────────────────────────┘
```

## Features

- **5 Scheduling Algorithms**: Supports `FCFS`, `SJF (Non-preemptive)`, `Priority (Preemptive)`, `Round Robin`, and `Adaptive Hybrid`.
- **High Performance Core**: C engine execution handles massive scale (tested up to 1000 processes) without blocking the UI, executing natively.
- **Explainable Decisions**: The real-time event log trace explains *why* processes were promoted, preempted, or aging inside the `Hybrid` algorithm.
- **Comparison Engine**: Run `Benchmarks` to spawn 5 concurrent instances of the engine, analyzing all algorithms side-by-side using identically seeded workloads.
- **Metrics**: Detailed tables for Turnaround Time, Waiting Time, Response Time, CPU Utilization, and Context Switches.

*(Insert Simulator View Screenshot Here)*

*(Insert Gantt Chart Screenshot Here)*

## The Adaptive Hybrid Scheduler

This project introduces a custom `HYBRID` scheduler combining Priority, Round Robin, and Shortest Remaining Time First (SRTF), governed by a robust **Aging** mechanism.

### Queue Priorities
1. **Real-Time Queue (High Priority)**: Executed strictly based on Priority (preemptive).
2. **Interactive Queue (Medium Priority)**: Executed via Round Robin with an **Adaptive Quantum** based on system load.
3. **Batch Queue (Low Priority)**: Executed via Shortest Remaining Time First (SRTF).

### Advanced Mechanisms
* **Aging Mechanism**: If a `BATCH` process starves (waiting time exceeds `Aging Threshold`), it is dynamically promoted to `INTERACTIVE`.
* **Adaptive Quantum**: The `INTERACTIVE` queue scales its Round Robin quantum inversely proportional to the number of processes in the queue, ensuring low latency for many tasks.

*(Insert Benchmarks Comparison Screenshot Here)*

## Installation & Usage

Requires `Node.js 18+`, `Python 3`, and `GCC`.

### 1. Compile the C Engine
```bash
cd scheduler
make
```

### 2. Start the Backend API
```bash
cd backend
npm install
npm run start
```

### 3. Start the Next.js Frontend
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000` in your browser.

## Deployment

SchedX is production-ready via Docker. The backend containerizes the C compiler, builds the engine, and serves the Express API securely.

```bash
docker build -t schedx-backend .
docker run -p 3001:3001 schedx-backend
```
The Next.js frontend can be seamlessly deployed on Vercel or any static host. Set `NEXT_PUBLIC_API_URL` to point to the backend instance.

## Testing and CI/CD

SchedX has a rigorous test suite enforcing mathematical invariants at every layer of the stack.

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

**Build Next.js Frontend**
```bash
cd frontend
npm run build
```

Memory safety in C is validated via AddressSanitizer (`make asan`), eliminating Stack Overflow constraints for large JSON payloads.
