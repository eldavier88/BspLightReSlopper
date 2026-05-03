import { useEffect, useState, useCallback, type FormEvent } from 'react';
import { listJobs, cancelJob, createJob, type Job } from '../services/api';
import { subscribeToJob } from '../services/signalr';

interface Props {
  onSelect: (job: Job | null) => void;
  selected: Job | null;
}

export default function JobList({ onSelect, selected }: Props) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [mapName, setMapName] = useState('');
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setJobs(await listJobs());
  }, []);

  useEffect(() => {
    refresh();
    const iv = setInterval(refresh, 5000);
    return () => clearInterval(iv);
  }, [refresh]);

  useEffect(() => {
    if (!selected) return;
    const unsub = subscribeToJob(selected.id, (msg: { jobId: string; progressPercent: number; status: string }) => {
      setJobs((prev: Job[]) =>
        prev.map((j: Job) =>
          j.id === msg.jobId
            ? { ...j, status: msg.status, progressPercent: msg.progressPercent }
            : j
        )
      );
      if (msg.status === 'completed' || msg.status === 'failed') refresh();
    });
    return unsub;
  }, [selected, refresh]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!mapName.trim()) return;
    setLoading(true);
    await createJob({ mapName: mapName.trim(), halfLambert: false });
    setMapName('');
    setLoading(false);
    refresh();
  }

  return (
    <div style={{ padding: 8 }}>
      <form onSubmit={handleSubmit} style={{ marginBottom: 12 }}>
        <input
          placeholder="map name"
          value={mapName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMapName(e.target.value)}
          style={{ width: '100%', padding: 6, background: '#1a1a1f', border: '1px solid #333', color: '#eee' }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', marginTop: 6, padding: 6, background: '#2a5', border: 'none', color: '#fff', cursor: 'pointer' }}
        >
          {loading ? 'Queueing…' : 'Estimate'}
        </button>
      </form>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {jobs.map((job: Job) => (
          <div
            key={job.id}
            onClick={() => onSelect(job.id === selected?.id ? null : job)}
            style={{
              padding: 8,
              borderRadius: 4,
              background: selected?.id === job.id ? '#1a3a5c' : '#1a1a1f',
              border: '1px solid #333',
              cursor: 'pointer',
              fontSize: 12,
            }}
          >
            <div style={{ fontWeight: 600 }}>{job.name}</div>
            <div style={{ color: job.status === 'completed' ? '#4a5' : job.status === 'failed' ? '#a45' : '#888' }}>
              {job.status} {job.progressPercent > 0 && job.progressPercent < 100 ? `${job.progressPercent}%` : ''}
            </div>
            {job.status === 'running' && (
              <button
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => { e.stopPropagation(); cancelJob(job.id); refresh(); }}
                style={{ marginTop: 4, padding: '2px 8px', background: '#a33', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 11 }}
              >
                Cancel
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
