using Lekarzowo.DataAccessLayer.DTO;
using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories.Interfaces
{
    public interface IReservationsRepository : IBaseRepository<Reservation>
    {

        /// <summary>
        /// Returns all reservations in db meeting given criteria. All criteria are optional.
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
        /// Upcoming visits sorted from nearest to furthest. Limit the number od loaded items. Optionally skip given number of rows for pagination.
        /// </summary>
        /// <param name="PatientId"></param>
        /// <param name="Limit"></param>
        /// <param name="Skip"></param>
        /// <returns></returns>
        //Task<IEnumerable<object>> UpcomingReservations(decimal PatientId, int? Limit, int? Skip);

        //ekran wizyt

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
        Task<IEnumerable<object>> RecentReservations(decimal PatientId, bool showUpcomingInstead, int? Limit, int? Skip);

        /// <summary>
        /// Returns true if none of existing reservations in a given local and with a given doctor overlap passed reservation.
        /// </summary>
        /// <param name="res"></param>
        /// <returns></returns>
        Task<IEnumerable<Reservation>> IsReservationOverlappingWithAnother(decimal localId, decimal doctorId, DateTime start, DateTime end);

        /// <summary>
        /// Returmns true if a reservation with those attributes already exists in a db.
        /// </summary>
        /// <param name="res"></param>
        /// <returns></returns>
        Task<bool> Exists(Reservation res);
    }
}
