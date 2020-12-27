using Microsoft.EntityFrameworkCore;
using System;

namespace Lekarzowo.DataAccessLayer.Models
{
    public interface IModelContext : IDisposable
    {
        DbSet<City> City { get; set; }
        DbSet<Doctor> Doctor { get; set; }
        DbSet<Illness> Illness { get; set; }
        DbSet<Illnesshistory> Illnesshistory { get; set; }
        DbSet<Local> Local { get; set; }
        DbSet<Medicine> Medicine { get; set; }
        DbSet<Medicinehistory> Medicinehistory { get; set; }
        DbSet<Oldillnesshistory> Oldillnesshistory { get; set; }
        DbSet<Oldmedicinehistory> Oldmedicinehistory { get; set; }
        DbSet<Patient> Patient { get; set; }
        DbSet<Person> Person { get; set; }
        DbSet<Referral> Referral { get; set; }
        DbSet<Reservation> Reservation { get; set; }
        DbSet<Room> Room { get; set; }
        DbSet<Speciality> Speciality { get; set; }
        DbSet<Treatment> Treatment { get; set; }
        DbSet<Treatmentonvisit> Treatmentonvisit { get; set; }
        DbSet<Visit> Visit { get; set; }
        DbSet<Workinghours> Workinghours { get; set; }
        

        int SaveChanges();
        void MarkAsModified<T>(T item);
    }
}
