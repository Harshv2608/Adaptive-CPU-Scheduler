const { validateSimulationRequest } = require('../validators/simulation.validator');
const schedulerService = require('../services/scheduler.service');

exports.health = (req, res) => {
    res.status(200).json({ status: 'OK' });
};

exports.getAlgorithms = (req, res) => {
    res.status(200).json({
        algorithms: [
            { id: "FCFS", name: "First Come First Serve", preemptive: false },
            { id: "SJF", name: "Shortest Job First", preemptive: false },
            { id: "PRIORITY", name: "Priority Scheduling", preemptive: true },
            { id: "ROUND_ROBIN", name: "Round Robin", preemptive: true },
            { id: "HYBRID", name: "Adaptive Hybrid", preemptive: true }
        ]
    });
};

exports.simulate = async (req, res) => {
    const { processes, simulation } = req.body;
    
    const validationError = validateSimulationRequest(processes);
    if (validationError) {
        return res.status(400).json({
            error: "Invalid process configuration",
            details: [validationError]
        });
    }

    try {
        const result = await schedulerService.runSimulation(processes, simulation);
        res.status(200).json(result);
    } catch (error) {
        if (error.code === 'TIMEOUT') {
            return res.status(504).json({ error: "Scheduler simulation timed out" });
        }
        console.error("Simulation error:", error.message || error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
