using HuntLog.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace HuntLog.Api.Data;

// The DbContext is EF Core's "session" with the database. You query and save
// through it, and it turns LINQ like _db.Applications.Where(...) into SQL.
//
// Note: nothing in this file mentions SQLite. The provider is chosen in
// Program.cs, which is why switching to SQL Server doesn't touch this class.
public class HuntLogDbContext : DbContext
{
    // The options (provider + connection string) are passed in by
    // dependency injection. See AddDbContext in Program.cs.
    public HuntLogDbContext(DbContextOptions<HuntLogDbContext> options)
        : base(options)
    {
    }

    // Each DbSet<T> is a table.
    public DbSet<Application> Applications => Set<Application>();

    // Fine-tune how classes map to tables (the "Fluent API").
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Application>(entity =>
        {
            // Mirror the DTO limits in the schema so the database enforces them too.
            entity.Property(a => a.Company).HasMaxLength(100).IsRequired();
            entity.Property(a => a.Role).HasMaxLength(100).IsRequired();
            entity.Property(a => a.Notes).HasMaxLength(2000);

            // Save the enum as "Applied" instead of the number 1. That's easier
            // to read, and reordering the enum later can't corrupt old rows.
            entity.Property(a => a.Status).HasConversion<string>().HasMaxLength(20);

            // SQLite stores dates as plain text and forgets they were UTC.
            // Mark them as UTC when reading back, so JSON includes the "Z" suffix
            // and the browser converts to local time correctly.
            entity.Property(a => a.CreatedAt).HasConversion(
                toDb => toDb,
                fromDb => DateTime.SpecifyKind(fromDb, DateTimeKind.Utc));
        });
    }
}
