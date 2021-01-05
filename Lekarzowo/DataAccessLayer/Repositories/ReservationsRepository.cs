using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
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
        public ReservationsRepository(ModelContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Reservation>> GetAll(decimal patientId)
        {
            return await _context.Reservation.Where(x => x.PatientId == patientId).ToListAsync();
        }

        public async Task<bool> PatientAndDoctorHaveCommonReservation(decimal patientId, decimal doctorId)
        {
            return await _context.Reservation.AnyAsync(x => x.PatientId == patientId && x.DoctorId == doctorId && x.Canceled == false);
        }

        public async Task<object> GetByIdWithPatientData(decimal reservationId)
        {
            return await _context.Reservation
                .Select(x => new
                {
                    Id = x.Id,
                    DoctorId = x.DoctorId,
                    PatientId = x.PatientId,
                    PatientName = x.Patient.IdNavigation.Name,
                    PatientLastname = x.Patient.IdNavigation.Lastname,
                    Starttime = x.Starttime,
                    Endtime = x.Endtime,
                    Canceled = x.Canceled,
                    RoomId = x.RoomId,
                    Visit = x.Visit
                })
                .FirstOrDefaultAsync(x => x.Id == reservationId);
        }

        public async Task<Reservation> GetById(decimal reservationId)
        {
            return await _context.Reservation.Include(x => x.Visit).FirstOrDefaultAsync(x => x.Id == reservationId);
        }

        public async Task<bool> IsAnyReservationScheduledThatDay(decimal localId, decimal doctorId, DateTime from,
            DateTime to)
        {
            return await _context.Reservation
                .Where(x => x.DoctorId == doctorId)
                .Where(x => x.Room.LocalId == localId)
                .Where(x => x.Starttime >= from && x.Starttime < to)
                .Where(x => x.Endtime > from && x.Starttime <= to)
                .AnyAsync();
        }

        public IEnumerable<Reservation> AllByOptionalCriteria(decimal? CityId, decimal? SpecId, decimal? DoctorId,
            DateTime? start, DateTime? end)
        {
            var query = _context.Reservation
                .Include(x => x.Room).ThenInclude(x => x.Local)
                .Include(x => x.Doctor)
                .Where(x => !CityId.HasValue || x.Room.Local.CityId == CityId)
                .Where(x => !SpecId.HasValue || x.Doctor.SpecialityId == SpecId)
                .Where(x => !DoctorId.HasValue || x.DoctorId == DoctorId);

            if (start.HasValue && start.Value.Date > DateTime.Now.Date)
            {
                query = query.Where(x => x.Starttime.Date >= start.Value.Date);
            }
            else
            {
                query = query.Where(x => x.Starttime.Date >= DateTime.Now.Date);
            }

            if (end.HasValue)
            {
                query = query.Where(x => x.Starttime.Date <= end.Value.Date);
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

        public async Task<IEnumerable<object>> DoctorScheduleList(decimal doctorId, bool showRecent, DateTime? start,
            DateTime? end, int? limit, int? skip)
        {
            var query = _context.Reservation
                .Where(d => d.DoctorId == doctorId)
                .Where(x => x.Starttime.Date >= start.Value.Date && x.Endtime.Date <= end.Value.Date);

            query = showRecent
                ? query.Where(x => x.Visit != null && x.Canceled == false).Where(x => x.Starttime < DateTime.Now)
                : query.Where(x => x.Visit == null).Where(x => x.Starttime.AddMinutes(30) >= DateTime.Now);

            var anonymousQuery = query.Select(s => new
            {
                reservationId = s.Id,
                reservationStartTime = s.Starttime,
                reservationEndTime = s.Endtime,
                isCanceled = s.Canceled,
                localName = s.Room.Local.Name,
                roomNumber = s.Room.Number,
                patientId = s.Patient.Id,
                patientName = s.Patient.IdNavigation.Name,
                patientLastname = s.Patient.IdNavigation.Lastname,
                visit = _context.Visit.FirstOrDefault(y => y.ReservationId == s.Id)
            });

            IOrderedQueryable<object> orderedQuery = showRecent
                ? anonymousQuery.OrderByDescending(x => x.reservationStartTime)
                : anonymousQuery.OrderBy(x => x.reservationStartTime);

            var trimmedQuery = PaginationService<object>.SplitAndLimitQueryable(skip, limit, orderedQuery);

            return await trimmedQuery.ToListAsync();
        }

        public async Task<IEnumerable<object>> RecentOrUpcomingByPatientId(decimal patientId, bool showUpcomingInstead, 
            bool hideCanceledReservations, decimal? doctorId, DateTime? from, DateTime? to, int? limit, int? skip)
        {
            var reservationTypeQuery = _context.Reservation
                .Where(x => x.PatientId == patientId)
                .Where(x => doctorId == null || x.DoctorId == doctorId)
                .Where(x => from == null || x.Starttime.Date >= from.Value.Date)
                .Where(x => to == null || x.Endtime.Date <= to.Value.Date);

            if (hideCanceledReservations)
            {
                reservationTypeQuery = reservationTypeQuery.Where(x => x.Canceled == false);
            }

            reservationTypeQuery = showUpcomingInstead
                ? reservationTypeQuery
                    .Where(x => x.Visit == null)
                    .Where(x => x.Starttime.AddMinutes(30) >= DateTime.Now)
                : reservationTypeQuery
                    .Where(x => x.Visit != null)
                    .Where(x => x.Visit.OnGoing == false)
                    .Where(x => x.Starttime < DateTime.Now);

            var anonymousTypeQuery = reservationTypeQuery.Select(x => new
            {
                reservationId = x.Id,
                reservationStartTime = x.Starttime,
                reservationEndTime = x.Endtime,
                isCanceled = x.Canceled,
                doctorId = x.DoctorId,
                doctorName = x.Doctor.IdNavigation.Name,
                doctorLastname = x.Doctor.IdNavigation.Lastname,
                doctorSpecialization = x.Doctor.Speciality.Name,
                roomNumber = x.Room.Number,
                localName = x.Room.Local.Name,
                streetName = x.Room.Local.Streetname,
                streetNumber = x.Room.Local.Streetnumber,
                blockNumber = x.Room.Local.Blocknumber,
                postCode = x.Room.Local.Postcode,
                cityName = x.Room.Local.City.Name,
                visit = _context.Visit.FirstOrDefault(y => y.ReservationId == x.Id)
            });

            IOrderedQueryable<object> orderedQuery = showUpcomingInstead
                ? anonymousTypeQuery.OrderBy(x => x.reservationStartTime)
                : anonymousTypeQuery.OrderByDescending(x => x.reservationStartTime);

            var trimmedQuery = PaginationService<object>.SplitAndLimitQueryable(skip, limit, orderedQuery);

            return await trimmedQuery.ToListAsync();
        }

        public async Task<IEnumerable<Reservation>> OverlappingReservations(decimal localId, decimal doctorId,
            DateTime start, DateTime end)
        {
            var query = _context.Reservation
                .Where(x => x.Room.LocalId == localId)
                .Where(x => x.DoctorId == doctorId)
                .Where(x => x.Starttime.Date == start.Date)
                .Where(x => start <= x.Starttime && end > x.Starttime ||
                            start >= x.Starttime && end <= x.Endtime ||
                            start <= x.Starttime && end >= x.Endtime ||
                            start < x.Endtime && end >= x.Endtime);

            return await query.ToListAsync();
        }

        public async Task<bool> IsReservationOverlappingWithAnother(decimal localId, decimal doctorId, DateTime start,
            DateTime end)
        {
            var query = _context.Reservation
                .Where(x => x.Room.LocalId == localId)
                .Where(x => x.DoctorId == doctorId)
                .Where(x => x.Starttime.Date == start.Date)
                .AllAsync(x => (x.Starttime < start && x.Endtime <= start) || (x.Starttime >= end));

            return !await query;
        }

        public async Task<bool> Exists(Reservation res)
        {
            return await _context.Reservation.AnyAsync(
                x => x.Room.LocalId == res.Room.LocalId
                     && x.Starttime == res.Starttime
                     && x.Endtime == res.Endtime
                     && x.DoctorId == res.DoctorId);
        }

        public async Task<bool> IsOwnedByPatient(decimal patientId, decimal reservationId)
        {
            return await _context.Reservation.AnyAsync(x => x.PatientId == patientId && x.Id == reservationId);
        }
    }
}
