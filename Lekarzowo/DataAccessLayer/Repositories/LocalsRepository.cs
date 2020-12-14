using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Lekarzowo.Services;

namespace Lekarzowo.DataAccessLayer.Repositories
{
    public class LocalsRepository : BaseNameRepository<Local>, ILocalsRepository
    {
        public LocalsRepository(ModelContext context) : base(context) {}


        public async Task<IEnumerable<Local>> DoctorsWorkplaces(decimal doctorId, int days, int? limit, int? skip)
        {
            var query = _context.Workinghours
                .Where(x => x.DoctorId == doctorId)
                .Where(x => x.From.Date >= DateTime.Now.Date && x.From <= DateTime.Now.Date.AddDays(days))
                .Select(x => x.Local).Include(x => x.City)
                .Distinct()
                .OrderBy(x => x.City.Name)
                .ThenBy(x => x.Name);

            var trimmedQuery = PaginationService<Local>.SplitAndLimitQueryable(skip, limit, query);

            return await query.ToListAsync();
        }
    }
}
