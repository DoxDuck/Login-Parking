using Microsoft.EntityFrameworkCore;

namespace SWP391.Entities
{
    public class ScientificTrendDbContext : DbContext
    {
        public ScientificTrendDbContext(DbContextOptions<ScientificTrendDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users => Set<User>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(user => user.UserId);
                entity.Property(user => user.Email)
                    .HasMaxLength(255)
                    .IsRequired();
                entity.HasIndex(user => user.Email)
                    .IsUnique();
                entity.Property(user => user.PasswordHash)
                    .HasMaxLength(500)
                    .IsRequired();
                entity.Property(user => user.FullName)
                    .HasMaxLength(150);
                entity.Property(user => user.CreatedAt)
                    .HasDefaultValueSql("GETUTCDATE()");
                entity.Property(user => user.IsActive)
                    .HasDefaultValue(true);
            });
        }
    }
}
