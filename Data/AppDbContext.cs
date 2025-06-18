using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SmsSablon.Models;

namespace SmsSablon.Data
{
    public class AppDbContext : IdentityDbContext<ApplicationUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<SmsHeader> SmsHeaders { get; set; }
        public DbSet<Info> Infos { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // SmsHeader - Info ilişkisi
            modelBuilder.Entity<Info>()
                .HasOne(i => i.SmsHeader)
                .WithMany(h => h.Infos)
                .HasForeignKey(i => i.SmsHeaderId);

            // SmsHeader seed verisi
            modelBuilder.Entity<SmsHeader>().HasData(
                new SmsHeader { Id = 1, Header = "Duyuru" },
                new SmsHeader { Id = 2, Header = "Bilgilendirme" }
            );

            // Info seed verisi (SmsHeaderId foreign key ile bağlı)
            modelBuilder.Entity<Info>().HasData(
                new Info { Id = 1, SmsText = "Yarın tatil!", IsLocked = false, TemplateName = "Genel", SmsHeaderId = 1 },
                new Info { Id = 2, SmsText = "Yeni etkinlik var", IsLocked = true, TemplateName = "Etkinlik", SmsHeaderId = 1 },
                new Info { Id = 3, SmsText = "Sistem bakımı yapılacak.", IsLocked = false, TemplateName = "Teknik", SmsHeaderId = 2 }
            );
        }
    }
}
