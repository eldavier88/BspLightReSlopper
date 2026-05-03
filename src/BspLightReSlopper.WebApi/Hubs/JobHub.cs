using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace BspLightReSlopper.WebApi.Hubs
{
    public interface IJobClient
    {
        Task JobProgress(Guid jobId, int percent, string message);
        Task JobCompleted(Guid jobId, string status, string? result);
        Task JobLog(Guid jobId, string line);
    }

    public class JobHub : Hub<IJobClient>
    {
        public async Task Subscribe(Guid jobId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, jobId.ToString());
        }

        public async Task Unsubscribe(Guid jobId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, jobId.ToString());
        }
    }
}
