📄 SchedX: Adaptive CPU Scheduler Platform
SchedX is an enterprise-grade educational web application designed to visualize and simulate Operating System CPU scheduling algorithms. It demonstrates an end-to-end full-stack pipeline that transforms low-level C systems programming into highly interactive, real-time React visualizations using a robust Node.js API bridge.

🚀 Key Features
📍 High-Performance Native Simulation Engine
Uses a compiled C binary to execute complex scheduling mathematics natively.
Simulates FCFS, SJF, Priority, Round Robin, and Adaptive Hybrid algorithms with zero UI blocking.
🧠 Deterministic Adaptive Hybrid Scheduler
Replaces standard generic algorithms with a custom Multi-Level Queue (MLQ) implementation.
Evaluates processes based on Class: REAL-TIME (Preemptive), INTERACTIVE (Adaptive Round Robin), and BATCH (SRTF).
Provides strict starvation prevention via dynamic Aging (promoting BATCH processes to INTERACTIVE over time).
🛡️ Backend-Controlled Execution Pipeline
Strict linear lifecycle: C decides → JSON records → React visualizes.
Built with Node.js `child_process.spawn()` to guarantee secure, isolated execution of the C binary for every API request.
🧪 Automated Math Invariant Assessment
Deterministic Python test suite evaluates CPU utilization, turnaround times, and Gantt contiguity.
Memory-safe C execution enforced via AddressSanitizer (ASan) to prevent buffer overflows on large JSON payloads.
🔐 Secure Cross-Origin API
Strict CORS policies lock down the Express API to the production Vercel domain.
Payload size limitations enforce stability during massive 500-process stress tests.

🛠️ Tech Stack
| Category | Technology |
| --- | --- |
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion |
| Backend Engine | Node.js, Express.js, Jest |
| Core Simulator | C (Native Executable) |
| Testing | Python `unittest`, AddressSanitizer |
| Deployment | Vercel (Frontend), Render (Backend API), Docker (Containerization) |

📂 Project Structure
```text
Adaptive-CPU-Scheduler/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   ├── tests/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   └── lib/
│   ├── next.config.mjs
│   └── tailwind.config.ts
├── scheduler/
│   ├── src/
│   │   ├── algorithms/
│   │   ├── main.c
│   │   └── json.c
│   ├── tests/
│   └── Makefile
├── Dockerfile
└── README.md
```

⚙️ Installation
1. Clone the Repository
```bash
git clone https://github.com/Harshv2608/Adaptive-CPU-Scheduler.git
cd Adaptive-CPU-Scheduler
```

2. C Engine Setup
Requires GCC compiler. Compile the native engine:
```bash
cd scheduler
make
cd ..
```

3. Backend Setup
Open a new terminal:
```bash
cd backend
npm install
npm run start
```
The Express API will run on `http://localhost:3001`.

4. Frontend Setup
Open a new terminal:
```bash
cd frontend
npm install
npm run dev
```
The application will automatically open in your browser at `http://localhost:3000`.

🧠 How It Works
```text
User Configures Workload (Vercel Frontend)
│
▼
HTTP POST /api/simulate (Express Backend)
│
▼
Node.js spawns C Engine with JSON stdin
│
▼
C Engine calculates ticks, preemptions, & aging
│
▼
C Engine stdout: JSON Execution Trace
│
▼
Backend validates trace & returns HTTP 200 OK
│
▼
React renders Animated Gantt Charts & Metrics
```

📈 Impact
This project demonstrates how low-level systems programming and strict deterministic algorithms can be modernized into a full-stack web application by:
- Bridging the gap between academic C programming and modern Next.js visualization.
- Preventing main-thread UI freezing by offloading heavy simulations to a native binary.
- Enforcing algorithmic correctness at the API level via dual-layer testing (Jest + Python).
- Creating structured, traceable pipelines from OS logic to user-facing analytics.

🎯 Future Improvements
- Support for Multi-Core CPU Scheduling architectures (SMP).
- Export historical simulation data to Excel and CSV.
- Real-time WebSockets for massive simulations that exceed standard HTTP timeout limits.
- Interactive memory management and paging simulation integration.

📜 License
This project is licensed under the MIT License.

👨‍💻 Author
Harsh Vardhan
GitHub: https://github.com/Harshv2608

⭐ If you found this project useful, consider giving it a star!
