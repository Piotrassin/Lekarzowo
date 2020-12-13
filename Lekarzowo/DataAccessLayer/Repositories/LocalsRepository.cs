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


        /// <summary>
        /// TODO: Nie działa nie wiedzieć czemu
        /// </summary>
        /// <param name="local"></param>
        /// <returns></returns>
        public bool Exists(Local local)
        {
            return _context.Local.Any(x => x.Postcode == local.Postcode);
            //return _context.Local.Any(x => x.Postcode == "00-902");
        }

        public async Task<IEnumerable<Local>> DoctorsWorkplaces(decimal doctorId, int? limit, int? skip)
        {
            var query = _context.Workinghours
                .Where(x => x.DoctorId == doctorId)
                .Select(x => x.Local).Include(x => x.City)
                .Distinct()
                .OrderBy(x => x.City.Name)
                .ThenBy(x => x.Name);

            var trimmedQuery = PaginationService<Local>.SplitAndLimitQueryable(skip, limit, query);

            return await query.ToListAsync();
        }
    }
}
