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
                    id = x.Id, 
                    name = x.Treatment.Name,
                    description = x.Description
                }).OrderBy(x => x.name);

            var orderedQuery = PaginationService<object>.SplitAndLimitQueryable(skip, limit, query);

            return await orderedQuery.ToListAsync();
        }

        public async Task<IEnumerable<Treatmentonvisit>> PerformedTreatmentsAsTreatments(decimal visitId)
        {
            var query = _context.Treatmentonvisit.Where(x => x.VisitId == visitId)
                .Select(x => new Treatmentonvisit
                {
                    Id = x.Id,
                    Treatment = new Treatment()
                    {
                        Price = x.Treatment.Price
                    }
                });

            return await query.ToListAsync();
        }
    }
}
