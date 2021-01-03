using Lekarzowo.DataAccessLayer.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories.Interfaces
{
    public interface IReservationsRepository : IBaseIdRepository<Reservation>
    {
        /// <summary>
        /// Returns all reservations with a given patient's id.
        /// </summary>
        /// <param name="patientId"></param>
        /// <returns></returns>
        Task<IEnumerable<Reservation>> GetAll(decimal patientId);

        /// <summary>
        /// Checks if given doctor and patient have at least one mutual reservation that wasn't canceled.
        /// </summary>
        /// <param name="patientId"></param>
        /// <param name="doctorId"></param>
        /// <returns></returns>
        Task<bool> PatientAndDoctorHaveCommonReservation(decimal patientId, decimal doctorId);

        /// <summary>
        /// Reservation data with included short patient data
        /// </summary>
        /// <param name="reservationId"></param>
        /// <returns></returns>
        Task<object> GetByIdWithPatientData(decimal reservationId);

        /// <summary>
        /// Returns data of a reservation with a given id with included visit data.
        /// </summary>
        /// <param name="reservationId"></param>
        /// <returns></returns>
        Task<Reservation> GetById(decimal reservationId);

        /// <summary>
        /// Checks if any reservation meets given criteria.
        /// </summary>
        /// <param name="localId"></param>
        /// <param name="doctorId"></param>
        /// <param name="from"></param>
        /// <param name="to"></param>
        /// <returns></returns>
        Task<bool> IsAnyReservationScheduledThatDay(decimal localId, decimal doctorId, DateTime from, DateTime to);

        /// <summary>
        /// Checks if given reservations is owned by given patient.
        /// </summary>
        /// <param name="patientId"></param>
        /// <returns></returns>
        Task<bool> IsOwnedByPatient(decimal patientId, decimal reservationId);

        /// <summary>
        /// Returns all reservations in db meeting given criteria. AllByPatientId criteria are optional.
        /// </summary>
        /// <returns></returns>
        IEnumerable<Reservation> AllByOptionalCriteria(decimal? CityId, decimal? SpecId, decimal? DoctorId, DateTime? start, DateTime? end);

        /// <summary>
        /// Returns all reservations in a given LOCAL that are in-progress in a time frame given between dates START and END.
        /// </summary>
        /// <param name="LocalId"></param>
        /// <param name="start"></param>
        /// <param name="end"></param>
        /// <returns></returns>
        Task<IEnumerable<Reservation>> AllInProgressByLocal(decimal LocalId, DateTime start, DateTime end);

        /// <summary>
        /// Returns a list of reservations for a given doctor in a given local happening between start and end dates.
        /// If they are upcoming, then only reservations are returned including those canceled.
        /// If they're recent reservations, then Visit object is included and canceled reservations are excluded.
        /// </summary>
        /// <param name="doctorId"></param>
        /// <param name="localId"></param>
        /// <param name="showRecent"></param>
        /// <param name="start"></param>
        /// <param name="end"></param>
        /// <returns></returns>
        Task<IEnumerable<object>> DoctorScheduleList(decimal doctorId, bool showRecent, DateTime? start, DateTime? end, int? limit, int? skip);

        /// <summary>
        /// Returns IEnumerable<object> of recent visits sorted from most recent.
        /// If bool argument is true, method will instead return upcoming reservations sorted from the nearest to furthest in date.
        /// Limit the number od loaded items. Optionally skip given number of rows for pagination.
        /// </summary>
        /// <param name="patientId"></param>
        /// <param name="showUpcomingInstead"></param>
        /// <param name="limit"></param>
        /// <param name="skip"></param>
        /// <returns></returns>
        Task<IEnumerable<object>> RecentOrUpcomingByPatientId(decimal patientId, bool showUpcomingInstead, bool hideCanceledReservations, decimal? doctorId, DateTime? from, DateTime? to, int? limit, int? skip);

        /// <summary>
        /// Returns true if none of existing reservations in a given local and with a given doctor overlap passed reservation.
        /// </summary>
        /// <param name="res"></param>
        /// <returns></returns>
        Task<IEnumerable<Reservation>> OverlappingReservations(decimal localId, decimal doctorId, DateTime start, DateTime end);

        /// <summary>
        /// Checks if all other reservations overlap given reservation.
        /// </summary>
        /// <param name="localId"></param>
        /// <param name="doctorId"></param>
        /// <param name="start"></param>
        /// <param name="end"></param>
        /// <returns></returns>
        Task<bool> IsReservationOverlappingWithAnother(decimal localId, decimal doctorId, DateTime start, DateTime end);

        /// <summary>
        /// Returmns true if a reservation with those attributes already exists in a db.
        /// </summary>
        /// <param name="res"></param>
        /// <returns></returns>
        Task<bool> Exists(Reservation res);

    }
}
