const { spawn } = require('child_process');
const path = require('path');

const ENGINE_PATH = process.env.SCHEDULER_ENGINE_PATH || path.resolve(__dirname, '../../../scheduler/scheduler_engine.exe');

exports.runSimulation = (processes, config) => {
    return new Promise((resolve, reject) => {
        let inputString = `${processes.length}\n`;
        const typeMap = { 'REAL_TIME': 1, 'INTERACTIVE': 2, 'BATCH': 3 };
        
        for (const p of processes) {
            inputString += `${p.arrivalTime} ${p.burstTime} ${p.priority} ${typeMap[p.type]}\n`;
        }

        const args = ['--json'];
        if (config && config.algorithm) {
            args.push('--algo', config.algorithm);
        }
        if (config && config.timeQuantum) {
            args.push('--quantum', config.timeQuantum.toString());
        }

        const child = spawn(ENGINE_PATH, args);
        
        let stdoutData = '';
        let stderrData = '';
        let isDone = false;

        const timeout = setTimeout(() => {
            if (!isDone) {
                child.kill();
                const err = new Error("Timeout");
                err.code = 'TIMEOUT';
                reject(err);
            }
        }, 5000);

        child.stdout.on('data', (data) => {
            stdoutData += data.toString();
        });

        child.stderr.on('data', (data) => {
            stderrData += data.toString();
        });

        child.on('close', (code) => {
            isDone = true;
            clearTimeout(timeout);
            
            if (code !== 0) {
                const err = new Error(`Engine exited with code ${code}`);
                err.stderr = stderrData;
                return reject(err);
            }
            
            try {
                const jsonResult = JSON.parse(stdoutData);
                resolve(jsonResult);
            } catch (err) {
                err.message = "Failed to parse JSON from engine";
                reject(err);
            }
        });
        
        child.on('error', (err) => {
            isDone = true;
            clearTimeout(timeout);
            reject(err);
        });
        
        child.stdin.write(inputString);
        child.stdin.end();
    });
};
