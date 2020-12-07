using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories.Interfaces
{
    public interface ITreatmentsOnVisitRepository : IBaseRepository<Treatmentonvisit>
    {
        /// <summary>
        /// Treatments performed during current visit
        /// </summary>
        /// <param name="visitId"></param>
        /// <param name="limit"></param>
        /// <param name="skip"></param>
        /// <returns></returns>
        Task<IEnumerable<object>> PerformedTreatments(decimal visitId, int? limit, int? skip);
    }
}
