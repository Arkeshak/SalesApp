using API.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Client> Clients { get; set; } = null!;
        public DbSet<Item> Items { get; set; } = null!;
        public DbSet<Order> Orders { get; set; } = null!;
        public DbSet<OrderLine> OrderLines { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Seed some data for testing
            modelBuilder.Entity<Client>().HasData(
                new Client { Id = 1, CustomerName = "John Doe", Address1 = "123 Main St", Address2 = "Apt 4B", Suburb = "Springfield", State = "IL", PostCode = "62701" },
                new Client { Id = 2, CustomerName = "Jane Smith", Address1 = "456 Oak Ave", Suburb = "Metropolis", State = "NY", PostCode = "10001" }
            );

            modelBuilder.Entity<Item>().HasData(
                new Item { Id = 1, ItemCode = "ITM001", Description = "Laptop", Price = 1200.00m },
                new Item { Id = 2, ItemCode = "ITM002", Description = "Mouse", Price = 25.00m },
                new Item { Id = 3, ItemCode = "ITM003", Description = "Keyboard", Price = 75.00m }
            );
        }
    }
}
