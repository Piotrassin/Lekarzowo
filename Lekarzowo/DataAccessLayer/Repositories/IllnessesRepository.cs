using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Lekarzowo.Services;
using Microsoft.EntityFrameworkCore;

namespace Lekarzowo.DataAccessLayer.Repositories
{
    public class IllnessesRepository : BaseNameRepository<Illness>, IIllnessesRepository
    {
        public IllnessesRepository(ModelContext context) : base(context) {}

        //TODO
        public async Task<IEnumerable<Illness>> AllByNameOnVisit(decimal visitId, string name, int? limit, int? skip)
        {
            var query = _context.Illnesshistory
                .Where(x => x.VisitId == visitId)
                .Where(x => name == null || x.Illness.Name.ToLower().Contains(name.ToLower()))
                .Select(x => x.Illness).OrderBy(x => x.Name);

            var orderedQuery = (IOrderedQueryable<Illness>) PaginationService<Illness>.SplitAndLimitQueryable(skip, limit, query);

            return (ICollection<Illness>) await orderedQuery.ToListAsync();
        }
    }
}
