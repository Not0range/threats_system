using Microsoft.EntityFrameworkCore;

using webapi.Entities;

namespace webapi
{
    public class DatabaseContext : DbContext
    {
        public DatabaseContext() { }
        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options) { }
        public DbSet<User> Users { get; set; }
        public DbSet<ThreatsType> ThreatsTypes { get; set; }
        public DbSet<Source> Sources { get; set; }
        public DbSet<Threat> Threats { get; set; }
        public DbSet<District> Districts { get; set; }
        public DbSet<City> Cities { get; set; }
        public DbSet<Microdistrict> Microdistricts { get; set; }
    }
}
