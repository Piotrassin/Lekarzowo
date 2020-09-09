using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.Models
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




        //widoki
        DbQuery<View_AddressData> View_AddressData { get; set; }
        DbQuery<View_DocsAndSpecs> View_DocsAndSpecs { get; set; }
        DbQuery<View_DoctorList> View_DoctorList { get; set; }
        DbQuery<View_DoctorSchedule> View_DoctorSchedule { get; set; }
        DbQuery<View_IllnessMedDetails> View_IllnessMedDetails { get; set; }
        DbQuery<View_IllnessMedList> View_IllnessMedList { get; set; }
        //public virtual DbQuery<View_PatientIllnesses> View_PatientIllnesses { get; set; }

        DbQuery<View_VisitDetails> View_VisitDetails { get; set; }
        DbQuery<View_VisitList> View_VisitList { get; set; }


        int SaveChanges();
        void MarkAsModified<T>(T item);
    }
}
