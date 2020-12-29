using Lekarzowo.DataAccessLayer.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories.Interfaces
{
    public interface ITreatmentsOnVisitRepository : IBaseIdRepository<Treatmentonvisit>
    {
        /// <summary>
        /// Treatments performed during current visit
        /// </summary>
        /// <param name="visitId"></param>
        /// <param name="limit"></param>
        /// <param name="skip"></param>
        /// <returns></returns>
        Task<IEnumerable<object>> PerformedTreatments(decimal visitId, int? limit, int? skip);

        /// <summary>
        /// Returns specific information about treatment on visit and its corresponding treatment object.
        /// </summary>
        /// <param name="visitId"></param>
        /// <returns></returns>
        Task<IEnumerable<Treatmentonvisit>> PerformedTreatmentsAsTreatments(decimal visitId);
    }
}
