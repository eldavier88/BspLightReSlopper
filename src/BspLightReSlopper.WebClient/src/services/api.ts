export interface Job {
  id: string;
  name: string;
  status: string;
  progressPercent: number;
  createdAt: string;
  completedAt?: string;
  error?: string;
}

export interface EstimateRequest {
  mapName: string;
  filePath?: string;
  maxLights?: number;
  halfLambert: boolean;
}

const API = '/api/v1';

export async function listJobs(): Promise<Job[]> {
  const r = await fetch(`${API}/jobs`);
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function createJob(req: EstimateRequest): Promise<Job> {
  const r = await fetch(`${API}/jobs/estimate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function cancelJob(jobId: string): Promise<{ cancelled: boolean }> {
  const r = await fetch(`${API}/jobs/${jobId}/cancel`, { method: 'POST' });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}
