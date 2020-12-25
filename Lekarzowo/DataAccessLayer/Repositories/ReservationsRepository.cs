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
        public ReservationsRepository(ModelContext context) : base(context) { }

        public async Task<IEnumerable<Reservation>> GetAll(decimal patientId)
        {
            return await _context.Reservation.Where(x => x.PatientId == patientId).ToListAsync();
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

        public async Task<bool> IsAnyReservationScheduledThatDay(decimal localId, decimal doctorId, DateTime from, DateTime to)
        {
            return await _context.Reservation
                .Where(x => x.DoctorId == doctorId)
                .Where(x => x.Room.LocalId == localId)
                .Where(x => x.Starttime >= from && x.Starttime < to)
                .Where(x => x.Endtime > from && x.Starttime <= to)
                .AnyAsync();
        }

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

        public async Task<IEnumerable<object>> DoctorScheduleList(decimal doctorId, decimal localId, bool showRecent, DateTime? start, DateTime? end)
        {
            var query = _context.Reservation
                .Where(d => d.DoctorId == doctorId && d.Room.LocalId == localId)
                .Where(x => x.Starttime.Date >= start.Value.Date && x.Endtime.Date <= end.Value.Date);

            query = showRecent
                ? query.Where(x => x.Visit != null && x.Canceled == false).OrderByDescending(x => x.Starttime)
                : query.Where(x => x.Visit == null).OrderBy(x => x.Starttime);
            
            var anonymousQuery = query.Select(s => new
                {
                    reservationId = s.Id,
                    startTime = s.Starttime,
                    endTime = s.Endtime,
                    isCanceled = s.Canceled,
                    patientId = s.Patient.Id,
                    patientName = s.Patient.IdNavigation.Name,
                    patientLastname = s.Patient.IdNavigation.Lastname,
                    localName = s.Room.Local.Name,
                    roomNumber = s.Room.Number,
                    visit = _context.Visit.FirstOrDefault(y => y.ReservationId == s.Id)
                });

            return await anonymousQuery.ToListAsync();
        }

        public async Task<IEnumerable<object>> RecentOrUpcomingReservations(decimal patientId, bool showUpcomingInstead, bool hideCanceledReservations, int? limit, int? skip)
        {
            var reservationTypeQuery = _context.Reservation
                .Where(x => x.PatientId == patientId);

            if (hideCanceledReservations)
            {
                reservationTypeQuery = reservationTypeQuery.Where(x => x.Canceled == false);
            }

            reservationTypeQuery = showUpcomingInstead
                ? reservationTypeQuery.Where(x => x.Visit == null)
                : reservationTypeQuery.Where(x => x.Visit != null);

            var anonymousTypeQuery = reservationTypeQuery.Select(x => new
            {
                ReservationId = x.Id,
                DoctorSpecialization = x.Doctor.Speciality.Name,
                ReservationStartTime = x.Starttime,
                ReservationEndTime = x.Endtime,
                isCanceled = x.Canceled,
                DoctorName = x.Doctor.IdNavigation.Name,
                DoctorLastname = x.Doctor.IdNavigation.Lastname,
                Visit = _context.Visit.FirstOrDefault(y => y.ReservationId == x.Id)
            });

            IOrderedQueryable<object> orderedQuery = showUpcomingInstead 
                ? anonymousTypeQuery.Where(x => x.ReservationStartTime >= DateTime.Now).OrderBy(x => x.ReservationStartTime) 
                : anonymousTypeQuery.Where(x => x.ReservationStartTime < DateTime.Now).OrderByDescending(x => x.ReservationStartTime);

            var trimmedQuery = PaginationService<object>.SplitAndLimitQueryable(skip, limit, orderedQuery);
            
            return await trimmedQuery.ToListAsync();
        }

        public async Task<IEnumerable<Reservation>> OverlappingReservations(decimal localId, decimal doctorId, DateTime start, DateTime end)
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

        public async Task<bool> IsReservationOverlappingWithAnother(decimal localId, decimal doctorId, DateTime start, DateTime end)
        {
            var query = _context.Reservation
                .Where(x => x.Room.LocalId == localId)
                .Where(x => x.DoctorId == doctorId)
                .Where(x => x.Starttime.Date == start.Date)
                .AllAsync(x => (x.Starttime < start && x.Endtime <= start) || (x.Starttime >= end));

            return ! await query;
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
