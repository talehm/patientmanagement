using System;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.Extensions.Options;
using IdentityServer4.EntityFramework.Options;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using cepres.Models;
namespace cepres.Models
{
    public partial class PatientDBContext : IdentityDbContext
    {


        public PatientDBContext(
            DbContextOptions<PatientDBContext> options)
            :base(options)
            
        {
        }
        public virtual DbSet<MetaData> MetaData { get; set; }
        public virtual DbSet<Patient> Patient { get; set; }
        public virtual DbSet<Records> Records { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                 optionsBuilder.UseSqlServer("AzureDB");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<MetaData>(entity =>
            {
                entity.HasKey(x => x.Id);
                

                entity.Property(e => e.Key)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsFixedLength();

                entity.Property(e => e.Value)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsFixedLength();
            });

            modelBuilder.Entity<Patient>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.DateOfBirth)
                    .HasColumnType("date");

                entity.Property(e => e.Email)
                    .HasMaxLength(255);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(255);
            });

            modelBuilder.Entity<Records>(entity =>
            {
                entity.HasKey(e => e.Id);


                entity.Property(e => e.CreatedAt)
                    .HasDefaultValueSql("(getdate())");


                entity.Property(e => e.Disease)
                    .IsRequired()
                    .HasMaxLength(255);
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
