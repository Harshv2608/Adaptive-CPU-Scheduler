function validateTrace(result) {
    if (!result || !result.processMetrics || !result.processes) {
        throw new Error("Invalid simulation result structure");
    }

    const { processMetrics, processes, events } = result;

    processMetrics.forEach(pm => {
        const p = processes.find(p => p.id === pm.processId);
        if (!p) throw new Error(`Metric found for unknown process ${pm.processId}`);

        if (pm.waitingTime < 0) {
            throw new Error(`Process ${p.id} has negative waiting time`);
        }
        
        if (pm.turnaroundTime < p.burstTime) {
            throw new Error(`Process ${p.id} TAT (${pm.turnaroundTime}) < BT (${p.burstTime})`);
        }

        if (pm.completionTime < p.arrivalTime) {
            throw new Error(`Process ${p.id} completed before it arrived`);
        }
    });

    if (events && events.length > 0) {
        // Validate events are ordered by time
        let lastTime = 0;
        events.forEach(e => {
            if (e.time < lastTime) {
                throw new Error(`Trace events are not monotonically increasing in time: ${lastTime} -> ${e.time}`);
            }
            lastTime = e.time;
        });
    }

    return true;
}

module.exports = {
    validateTrace
};
