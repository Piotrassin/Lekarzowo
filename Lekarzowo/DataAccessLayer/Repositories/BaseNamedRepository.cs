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

        public BaseNamedRepository(ModelContext context) : base(context) 
        {
            table = _context.Set<T>();
        }

        public async Task<IEnumerable<T>> GetAllByName(string name)
        {
            return await table.Where(x => name == null || x.Name.ToLower().Contains(name.ToLower())).ToListAsync();
        }
    }
}
