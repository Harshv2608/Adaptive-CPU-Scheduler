exports.validateSimulationRequest = (processes) => {
    if (!processes || !Array.isArray(processes)) {
        return "processes must be an array";
    }
    if (processes.length < 1 || processes.length > 500) {
        return "process count must be between 1 and 500";
    }

    const seenIds = new Set();
    const validTypes = ['REAL_TIME', 'INTERACTIVE', 'BATCH'];

    for (let i = 0; i < processes.length; i++) {
        const p = processes[i];
        if (typeof p.id !== 'number' || p.id <= 0 || !Number.isInteger(p.id)) return `Process at index ${i} has invalid id`;
        if (seenIds.has(p.id)) return `Duplicate process id: ${p.id}`;
        seenIds.add(p.id);

        if (typeof p.arrivalTime !== 'number' || p.arrivalTime < 0 || !Number.isInteger(p.arrivalTime)) return `Process ${p.id} has invalid arrivalTime`;
        if (typeof p.burstTime !== 'number' || p.burstTime <= 0 || !Number.isInteger(p.burstTime)) return `Process ${p.id} has invalid burstTime`;
        if (typeof p.priority !== 'number' || p.priority < 0 || !Number.isInteger(p.priority)) return `Process ${p.id} has invalid priority`;
        if (!validTypes.includes(p.type)) return `Process ${p.id} has invalid type: ${p.type}`;
    }

    return null;
};
