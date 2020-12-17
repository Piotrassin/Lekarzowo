using Lekarzowo.DataAccessLayer.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories.Interfaces
{
    public interface IReservationsRepository : IBaseIdRepository<Reservation>
    {
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
        /// If no boundary dates were given, reservations happening on upcoming week starting from current date are returned.
        /// </summary>
        /// <param name="doctorId"></param>
        /// <param name="localId"></param>
        /// <param name="start"></param>
        /// <param name="end"></param>
        /// <returns></returns>
        Task<IEnumerable<object>> DoctorScheduleList(decimal doctorId, decimal localId, DateTime? start, DateTime? end);

        /// <summary>
        /// Returns IEnumerable<object> of recent visits sorted from most recent.
        /// If bool argument is true, method will instead return upcoming reservations sorted from the nearest to furthest in date.
        /// Limit the number od loaded items. Optionally skip given number of rows for pagination.
        /// </summary>
        /// <param name="PatientId"></param>
        /// <param name="showUpcomingInstead"></param>
        /// <param name="Limit"></param>
        /// <param name="Skip"></param>
        /// <returns></returns>
        Task<IEnumerable<object>> RecentOrUpcomingReservations(decimal PatientId, bool showUpcomingInstead, int? Limit, int? Skip);

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
