using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using Lekarzowo.Services;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories
{
    public class BaseNamedRepository<T> : BaseRepository<T>, IBaseNamedEntityRepository<T> where T : class, IEntity, INamedEntity
    {
        private readonly DbSet<T> table = null;
        public BaseNamedRepository(ModelContext context) : base(context) 
        {
            table = _context.Set<T>();
        }

        public async Task<IEnumerable<object>> GetAllByName(string name, int? limit, int? skip)
        {
            var query = table.Where(x => name == null || x.Name.ToLower().Contains(name.ToLower())).OrderBy(x => x.Name);

            var orderedQuery = PaginationService<T>.SplitAndLimitQueryable(skip, limit, query);

            return await orderedQuery.ToListAsync();
        }

        public async Task<T> GetSingleByName(string name)
        {
            return await table.Where(x => x.Name.ToLower() == name.ToLower()).FirstOrDefaultAsync();
        }
    }
}
