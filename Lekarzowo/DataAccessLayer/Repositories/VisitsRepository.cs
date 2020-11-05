using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using Lekarzowo.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories
{
    public class VisitsRepository : IVisitsRepository
    {
        private readonly ModelContext _context;
        public VisitsRepository(ModelContext context)
        {
            _context = context;
        }

        public void Delete(Visit t)
        {
            _context.Visit.Remove(t);
        }

        public bool Exists(decimal Id)
        {
            return _context.Visit.Any(x => x.ReservationId == Id);
        }

        public IEnumerable<Visit> GetAll()
        {
            return _context.Visit.ToList();
        }

        public Visit GetByID(decimal id)
        {
            return _context.Visit.Find(id);
        }

        public void Insert(Visit t)
        {
            _context.Visit.Add(t);
        }

        public void Save()
        {
            _context.SaveChanges();
        }

        public void Update(Visit t)
        {
            _context.Visit.Attach(t);
            _context.Entry(t).State = EntityState.Modified;
        }

        public async Task<IEnumerable<object>> RecentVisits(decimal PatientId, int Limit, int Skip)
        {
            var query = _context.Reservation
                .Where(x => x.PatientId == PatientId)
                .Where(x => x.Starttime < DateTime.Now)
                .Select(x => new
                {
                    ReservationId = x.Id,
                    DoctorSpecialization = x.Doctor.Speciality.Name,
                    ReservationStartTime = x.Starttime,
                    ReservationEndTime = x.Endtime,
                    DoctorName = x.Doctor.IdNavigation.Name,
                    DoctorLastname = x.Doctor.IdNavigation.Lastname,
                })
                .OrderByDescending(x => x.ReservationStartTime)
                .Skip(Skip)
                .Take(Limit)
                .ToListAsync();

            return await query;
        }

        public async Task<IEnumerable<object>> UpcomingVisits(decimal PatientId, int Limit, int Skip)
        {
            var query = _context.Reservation
                .Where(x => x.PatientId == PatientId)
                .Where(x => x.Starttime >= DateTime.Now)
                .Select(x => new
                {
                    ReservationId = x.Id,
                    DoctorSpecialization = x.Doctor.Speciality.Name,
                    ReservationStartTime = x.Starttime,
                    ReservationEndTime = x.Endtime,
                    DoctorName = x.Doctor.IdNavigation.Name,
                    DoctorLastname = x.Doctor.IdNavigation.Lastname,
                })
                .OrderBy(x => x.ReservationStartTime)
                .Skip(Skip)
                .Take(Limit)
                .ToListAsync();

            return await query;
        }
    }
}
