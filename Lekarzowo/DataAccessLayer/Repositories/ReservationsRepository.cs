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
    public class ReservationsRepository : BaseRepository<Reservation>, IReservationsRepository
    {
        public ReservationsRepository(ModelContext context) : base(context) { }



        public async Task<IEnumerable<object>> PossibleAppointments()
        {
            return await _context.Reservation.Where(x => x.Starttime >= DateTime.Now).ToListAsync();
        }

        public async Task<IEnumerable<object>> RecentReservations(decimal PatientId, int Limit, int Skip)
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

        public async Task<IEnumerable<object>> UpcomingReservations(decimal PatientId, int Limit, int Skip)
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
