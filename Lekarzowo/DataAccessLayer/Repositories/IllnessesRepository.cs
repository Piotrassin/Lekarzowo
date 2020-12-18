using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.Services;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories
{
    public class IllnessesRepository : BaseNameRepository<Illness>, IIllnessesRepository
    {
        public IllnessesRepository(ModelContext context) : base(context) {}

        public async Task<IEnumerable<object>> AllByNameOnVisit(decimal visitId, string name, int? limit, int? skip)
        {
            var query = _context.Illnesshistory
                .Where(x => x.VisitId == visitId)
                .Where(x => name == null || x.Illness.Name.ToLower().Contains(name.ToLower()))
                .Select(x => x.Illness).OrderBy(x => x.Name);

            IOrderedQueryable<object> orderedQuery = PaginationService<Illness>.SplitAndLimitQueryable(skip, limit, query);
            return await orderedQuery.ToListAsync();
        }
    }
}
