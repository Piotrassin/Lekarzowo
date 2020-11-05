using Lekarzowo.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories.Interfaces
{
    public interface IVisitsRepository : IBaseRepository<Visit>
    {
        /// <summary>
        /// Upcoming visits sorted from nearest to furthest. Limit the number od loaded items. Optionally skip given number of rows for pagination.
        /// </summary>
        /// <param name="PatientId"></param>
        /// <param name="Limit"></param>
        /// <param name="Skip"></param>
        /// <returns></returns>
        Task<IEnumerable<object>> UpcomingVisits(decimal PatientId, int Limit, int Skip);

        //ekran wizyt

        /// <summary>
        /// List of recent visits sorted from most recent. Limit the number od loaded items. Optionally skip given number of rows for pagination.
        /// </summary>
        /// <param name="PatientId"></param>
        /// <param name="Limit"></param>
        /// <param name="Skip"></param>
        /// <returns></returns>
        Task<IEnumerable<object>> RecentVisits(decimal PatientId, int Limit, int Skip);
    }
}
