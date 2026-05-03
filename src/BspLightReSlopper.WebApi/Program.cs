using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using BspLightReSlopper.WebApi.Data;
using BspLightReSlopper.WebApi.Hubs;
using BspLightReSlopper.WebApi.Services;

namespace BspLightReSlopper.WebApi
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }

    public class Startup
    {
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();
            services.AddSignalR();
            services.AddDbContext<AppDbContext>(opt =>
                opt.UseSqlite("Data Source=bsplrs.db"));
            services.AddHostedService<JobQueueService>();
            services.AddCors(opt =>
            {
                opt.AddPolicy("WebClient", p =>
                    p.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
            });
#if NET10_0_OR_GREATER
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen();
#endif
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
#if NET10_0_OR_GREATER
                app.UseSwagger();
                app.UseSwaggerUI();
#endif
            }

            app.UseRouting();
            app.UseCors("WebClient");
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<JobHub>("/hubs/jobs");
            });
        }
    }
}
