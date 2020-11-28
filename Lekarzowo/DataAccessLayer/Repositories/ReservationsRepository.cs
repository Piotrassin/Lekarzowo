using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using Lekarzowo.Models;
using Lekarzowo.Services;
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

        public IEnumerable<Reservation> GetAllFutureReservations(decimal? CityId, decimal? SpecId, decimal? DoctorId, DateTime? start, DateTime? end)
        {
            var query = _context.Reservation
                .Include(x => x.Room).ThenInclude(x => x.Local)
                .Include(x => x.Doctor)
                .Where(x => !CityId.HasValue || x.Room.Local.CityId == CityId)
                .Where(x => !SpecId.HasValue || x.Doctor.SpecialityId == SpecId)
                .Where(x => !DoctorId.HasValue || x.DoctorId == DoctorId);

            if (start.HasValue && start.Value.Date > DateTime.Now.Date)
            {
                query = query.Where(x => x.Starttime >= start.Value.Date);
            }
            else
            {
                query = query.Where(x => x.Starttime >= DateTime.Now);
            }

            if (end.HasValue)
            {
                query = query.Where(x => x.Starttime <= end.Value.Date);
            }

            return query.OrderBy(x => x.Starttime).ToList();
        }

        /// <summary>
        /// TODO: POŁĄCZYĆ TW DWIE METODY W JEDNĄ I W JAKIŚ SPOSÓB ZMIENIAĆ ZNAK "<" NA ">=" W ZALEŻNOSCI OD ZAPYTANIA
        /// </summary>
        /// <param name="PatientId"></param>
        /// <param name="limit"></param>
        /// <param name="skip"></param>
        /// <returns></returns>
        public async Task<IEnumerable<object>> RecentReservations(decimal PatientId, int? limit, int? skip)
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
                }).OrderByDescending(x => x.ReservationStartTime);

            var orderedQuery = PaginationService<object>.SplitAndLimitQueryable(skip, limit, query);
            
            return await orderedQuery.ToListAsync(); ;
        }

        public async Task<IEnumerable<object>> UpcomingReservations(decimal PatientId, int? limit, int? skip)
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
                }).OrderBy(x => x.ReservationStartTime);

            var orderedQuery = PaginationService<object>.SplitAndLimitQueryable(skip, limit, query);

            return await orderedQuery.ToListAsync(); ;
        }

        public async Task<bool> IsReservationPossible(Reservation res)
        {
            var query = _context.Reservation
                .Where(x => x.Room.LocalId == res.Room.LocalId)
                .Where(x => x.DoctorId == res.DoctorId)
                .Where(x => x.Starttime.Date == res.Starttime.Date)
                .AllAsync(x => (res.Starttime < x.Starttime && res.Endtime <= x.Starttime) || (res.Starttime >= x.Endtime));

            return await query;
        }

        public async Task<bool> Exists(Reservation res)
        {
            return await _context.Reservation.AnyAsync(
                x => x.Room.LocalId == res.Room.LocalId
                && x.Starttime == res.Starttime
                && x.Endtime == res.Endtime
                && x.DoctorId == res.DoctorId);
        }
    }
}
