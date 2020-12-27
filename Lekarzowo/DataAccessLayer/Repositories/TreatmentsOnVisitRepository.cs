using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using Lekarzowo.Services;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories
{
    public class TreatmentsOnVisitRepository : BaseIdRepository<Treatmentonvisit>, ITreatmentsOnVisitRepository
    {
        public TreatmentsOnVisitRepository(ModelContext context) : base(context) { }

        public async Task<IEnumerable<object>> PerformedTreatments(decimal visitId, int? limit, int? skip)
        {
            var query = _context.Treatmentonvisit.Where(x => x.VisitId == visitId)
                .Select(x => new
                {
                    Id = x.Id, 
                    TreatmentName = x.Treatment.Name,
                    TreatmentDescription = x.Description
                }).OrderBy(x => x.TreatmentName);

            var orderedQuery = PaginationService<object>.SplitAndLimitQueryable(skip, limit, query);

            return await orderedQuery.ToListAsync();
        }
    }
}
