const request = require('supertest');
const express = require('express');
const simulationRoutes = require('../src/routes/simulation.routes');

const app = express();
app.use(express.json());
app.use('/api', simulationRoutes);

describe('Simulation API', () => {
    it('GET /api/health should return OK', async () => {
        const res = await request(app).get('/api/health');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('status', 'OK');
        expect(res.body).toHaveProperty('engine', 'ready');
    });

    it('GET /api/algorithms should return supported algorithms', async () => {
        const res = await request(app).get('/api/algorithms');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('algorithms');
        expect(res.body.algorithms.length).toBeGreaterThan(0);
    });

    it('POST /api/simulate with invalid data should return 400', async () => {
        const res = await request(app)
            .post('/api/simulate')
            .send({
                processes: [{ arrivalTime: -1, burstTime: 0 }]
            });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
    });

    it('POST /api/simulate with valid data should return simulation results', async () => {
        const res = await request(app)
            .post('/api/simulate')
            .send({
                simulation: { algorithm: 'FCFS', timeQuantum: 4, agingThreshold: 10 },
                processes: [
                    { id: 1, arrivalTime: 0, burstTime: 5, priority: 1, type: "BATCH" }
                ]
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('simulation');
        expect(res.body).toHaveProperty('processes');
        expect(res.body).toHaveProperty('processMetrics');
        expect(res.body.processMetrics[0].completionTime).toEqual(5);
    });

    it('POST /api/compare should return comparison results', async () => {
        const res = await request(app)
            .post('/api/compare')
            .send({
                config: { timeQuantum: 4, agingThreshold: 10 },
                processes: [
                    { id: 1, arrivalTime: 0, burstTime: 5, priority: 1, type: "BATCH" }
                ]
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('workload');
        expect(res.body).toHaveProperty('results');
        expect(res.body.results).toHaveProperty('FCFS');
        expect(res.body.results).toHaveProperty('HYBRID');
    });
});
