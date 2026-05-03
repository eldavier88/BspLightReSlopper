import * as signalR from '@microsoft/signalr';

let hub: signalR.HubConnection | null = null;

export interface JobProgressMessage {
  jobId: string;
  progressPercent: number;
  status: string;
}

export function getHub(): signalR.HubConnection {
  if (!hub) {
    hub = new signalR.HubConnectionBuilder()
      .withUrl('/hubs/jobs')
      .withAutomaticReconnect()
      .build();
    hub.start().catch(console.error);
  }
  return hub;
}

export function subscribeToJob(
  jobId: string,
  onProgress: (msg: JobProgressMessage) => void
): () => void {
  const h = getHub();
  const handler = (id: string, percent: number, status: string) => {
    if (id === jobId) {
      onProgress({ jobId: id, progressPercent: percent, status });
    }
  };
  h.on('JobProgress', handler);
  h.invoke('Subscribe', jobId).catch(console.error);
  return () => {
    h.off('JobProgress', handler);
    h.invoke('Unsubscribe', jobId).catch(console.error);
  };
}
