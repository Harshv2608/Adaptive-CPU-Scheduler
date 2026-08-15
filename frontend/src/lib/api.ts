import { ProcessInput, SimulationResult, SimulationConfig, AlgorithmMetadata, ComparisonResult } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const api = {
  async health(): Promise<{ status: string }> {
    const res = await fetch(`${API_URL}/health`);
    if (!res.ok) throw new Error('API Health check failed');
    return res.json();
  },

  async getAlgorithms(): Promise<{ algorithms: AlgorithmMetadata[] }> {
    const res = await fetch(`${API_URL}/algorithms`);
    if (!res.ok) throw new Error('Failed to fetch algorithms');
    return res.json();
  },

  async simulate(processes: ProcessInput[], config: SimulationConfig): Promise<SimulationResult> {
    const res = await fetch(`${API_URL}/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ processes, simulation: config })
    });
    
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to simulate');
    }
    
    return res.json();
  },

  async compare(processes: ProcessInput[], config: SimulationConfig): Promise<ComparisonResult> {
    const res = await fetch(`${API_URL}/compare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ processes, config })
    });
    
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to compare');
    }
    
    return res.json();
  }
};
