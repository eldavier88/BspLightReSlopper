using System;
using Microsoft.EntityFrameworkCore;

namespace BspLightReSlopper.WebApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Job> Jobs => Set<Job>();
        public DbSet<LightResult> LightResults => Set<LightResult>();
        public DbSet<Map> Maps => Set<Map>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Job>(e =>
            {
                e.HasKey(x => x.Id);
                e.HasIndex(x => x.Status);
                e.HasIndex(x => x.CreatedAt);
            });
            modelBuilder.Entity<LightResult>(e =>
            {
                e.HasKey(x => x.Id);
                e.HasIndex(x => x.JobId);
            });
            modelBuilder.Entity<Map>(e =>
            {
                e.HasKey(x => x.Id);
                e.HasIndex(x => x.Name).IsUnique();
            });
        }
    }

    public class Job
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Name { get; set; } = string.Empty;
        public string Status { get; set; } = "queued"; // queued, running, completed, failed
        public string? Error { get; set; }
        public int ProgressPercent { get; set; }
        public string? Log { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? CompletedAt { get; set; }
        public Map? Map { get; set; }
        public Guid? MapId { get; set; }
    }

    public class LightResult
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid JobId { get; set; }
        public float OriginX { get; set; }
        public float OriginY { get; set; }
        public float OriginZ { get; set; }
        public float ColorR { get; set; }
        public float ColorG { get; set; }
        public float ColorB { get; set; }
        public float Intensity { get; set; }
        public string Method { get; set; } = string.Empty;
        public float Confidence { get; set; }
    }

    public class Map
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Name { get; set; } = string.Empty;
        public string FilePath { get; set; } = string.Empty;
        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
    }
}
