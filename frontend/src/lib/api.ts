import { ProcessInput, SimulationResult, AlgorithmMetadata } from './types';

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

  async simulate(processes: ProcessInput[]): Promise<SimulationResult> {
    const res = await fetch(`${API_URL}/simulate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ processes }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to run simulation');
    }

    return res.json();
  }
};
