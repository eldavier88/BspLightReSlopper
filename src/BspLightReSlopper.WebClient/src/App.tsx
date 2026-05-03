import { useState } from 'react';
import JobList from './components/JobList';
import BspViewer from './components/BspViewer';
import { Job } from './services/api';

export default function App() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <aside style={{ width: 320, borderRight: '1px solid #333', display: 'flex', flexDirection: 'column' }}>
        <header style={{ padding: 12, borderBottom: '1px solid #333' }}>
          <h1 style={{ margin: 0, fontSize: 16 }}>BspLightReSlopper</h1>
          <p style={{ margin: 0, fontSize: 11, color: '#888' }}>v2.0 (P1-P5)</p>
        </header>
        <JobList onSelect={setSelectedJob} selected={selectedJob} />
      </aside>
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <BspViewer job={selectedJob} />
        </div>
      </main>
    </div>
  );
}
