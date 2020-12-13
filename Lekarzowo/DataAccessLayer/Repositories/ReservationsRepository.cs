using Lekarzowo.DataAccessLayer.DTO;
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
    public class ReservationsRepository : BaseIdRepository<Reservation>, IReservationsRepository
    {
        public ReservationsRepository(ModelContext context) : base(context) { }

        public IEnumerable<Reservation> AllByOptionalCriteria(decimal? CityId, decimal? SpecId, decimal? DoctorId, DateTime? start, DateTime? end)
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

        public async Task<IEnumerable<Reservation>> AllInProgressByLocal(decimal localId, DateTime start, DateTime end)
        {
            return await _context.Reservation
                .Where(x => x.Room.LocalId == localId)
                .Where(x => x.Starttime.Date == start.Date)
                .Where(x => (x.Endtime > start && x.Endtime <= end) 
                || (x.Starttime >= start && x.Starttime < end) 
                || (x.Starttime < start && x.Endtime > end))
                .ToListAsync();
        }

        public async Task<IEnumerable<object>> DoctorScheduleList(decimal doctorId, decimal localId, DateTime? start, DateTime? end)
        {
            if (start == null)
            {
                start = DateTime.Now.Date;
            }

            if (end == null)
            {
                end = DateTime.Now.AddDays(7);
            }


            var query = _context.Reservation
                .Where(d => d.DoctorId == doctorId && d.Room.LocalId == localId)
                .Where(x => x.Starttime.Date >= start.Value.Date && x.Endtime.Date <= end.Value.Date)
                .Select(s => new
                {
                    reservationId = s.Id,
                    reservationStartTime = s.Starttime,
                    reservationEndTime = s.Endtime,
                    reservationIsCanceled = s.Canceled,
                    patientId = s.Patient.Id,
                    patientName = s.Patient.IdNavigation.Name,
                    patientLastname = s.Patient.IdNavigation.Lastname,
                    localName = s.Room.Local.Name,
                    roomNumber = s.Room.Number
                });
            var output = await query.ToListAsync();
            return output;
        }

        public async Task<IEnumerable<object>> RecentReservations(decimal patientId, bool showUpcomingInstead, int? limit, int? skip)
        {
            var reservationTypeQuery = _context.Reservation
                .Where(x => x.PatientId == patientId);

            var anonymousTypeQuery = reservationTypeQuery.Select(x => new
            {
                ReservationId = x.Id,
                DoctorSpecialization = x.Doctor.Speciality.Name,
                ReservationStartTime = x.Starttime,
                ReservationEndTime = x.Endtime,
                DoctorName = x.Doctor.IdNavigation.Name,
                DoctorLastname = x.Doctor.IdNavigation.Lastname,
            });

            IOrderedQueryable<object> orderedQuery = showUpcomingInstead 
                ? anonymousTypeQuery.Where(x => x.ReservationStartTime >= DateTime.Now).OrderBy(x => x.ReservationStartTime) 
                : anonymousTypeQuery.Where(x => x.ReservationStartTime < DateTime.Now).OrderByDescending(x => x.ReservationStartTime);

            var trimmedQuery = PaginationService<object>.SplitAndLimitQueryable(skip, limit, orderedQuery);
            
            return await trimmedQuery.ToListAsync(); ;
        }

        //public async Task<IEnumerable<object>> UpcomingReservations(decimal PatientId, int? limit, int? skip)
        //{
        //    var query = _context.Reservation
        //        .Where(x => x.PatientId == PatientId)
        //        .Where(x => x.Starttime >= DateTime.Now)
        //        .Select(x => new
        //        {
        //            ReservationId = x.Id,
        //            DoctorSpecialization = x.Doctor.Speciality.Name,
        //            ReservationStartTime = x.Starttime,
        //            ReservationEndTime = x.Endtime,
        //            DoctorName = x.Doctor.IdNavigation.Name,
        //            DoctorLastname = x.Doctor.IdNavigation.Lastname,
        //        }).OrderBy(x => x.ReservationStartTime);

        //    var orderedQuery = PaginationService<object>.SplitAndLimitQueryable(skip, limit, query);

        //    return await orderedQuery.ToListAsync(); ;
        //}

        public async Task<IEnumerable<Reservation>> IsReservationOverlappingWithAnother(decimal localId, decimal doctorId, DateTime start, DateTime end)
        {
            var query = _context.Reservation
                .Where(x => x.Room.LocalId == localId)
                .Where(x => x.DoctorId == doctorId)
                .Where(x => x.Starttime.Date == start.Date)
                .Where(x => (x.Starttime < start && x.Endtime <= start) || (x.Starttime >= end));

            return await query.ToListAsync();
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
