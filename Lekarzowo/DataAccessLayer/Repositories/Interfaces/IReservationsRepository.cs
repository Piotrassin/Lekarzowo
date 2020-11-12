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
        /// Compares doctors, workinghours and all Returns a list of all possible appointments which are split into 15 minute slots/pieces.
        /// </summary>
        /// <returns></returns>
        IEnumerable<Reservation> GetAllFutureReservations(decimal? CityId, decimal? SpecId, decimal? DoctorId, DateTime? start, DateTime? end);

        /// <summary>
        /// Upcoming visits sorted from nearest to furthest. Limit the number od loaded items. Optionally skip given number of rows for pagination.
        /// </summary>
        /// <param name="PatientId"></param>
        /// <param name="Limit"></param>
        /// <param name="Skip"></param>
        /// <returns></returns>
        Task<IEnumerable<object>> UpcomingReservations(decimal PatientId, int Limit, int Skip);

        //ekran wizyt

        /// <summary>
        /// List of recent visits sorted from most recent. Limit the number od loaded items. Optionally skip given number of rows for pagination.
        /// </summary>
        /// <param name="PatientId"></param>
        /// <param name="Limit"></param>
        /// <param name="Skip"></param>
        /// <returns></returns>
        Task<IEnumerable<object>> RecentReservations(decimal PatientId, int Limit, int Skip);

    }
}
