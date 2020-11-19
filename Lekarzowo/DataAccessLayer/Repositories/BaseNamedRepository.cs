using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
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
        private readonly int defaultLimit = 10;
        private readonly int defaultSkip = 0;
        public BaseNamedRepository(ModelContext context) : base(context) 
        {
            table = _context.Set<T>();
        }

        public async Task<IEnumerable<T>> GetAllByName(string name, int? limit, int? skip)
        {
            var query = table.Where(x => name == null || x.Name.ToLower().Contains(name.ToLower()));

            query = skip.HasValue ? query.Skip(skip.Value) : query.Skip(defaultSkip);
            query = limit.HasValue ? query.Take(limit.Value) : query.Take(defaultLimit);

            return await query.OrderBy(x => x.Name).ToListAsync();
        }

        public async Task<T> GetSingleByName(string name)
        {
            return await table.Where(x => x.Name.ToLower() == name.ToLower()).FirstOrDefaultAsync();
        }
    }
}
