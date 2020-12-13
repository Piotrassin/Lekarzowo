using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using Lekarzowo.Services;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories
{
    public class BaseNameRepository<T> : BaseIdRepository<T>, IBaseNameRepository<T> where T : class, IEntity, INamedEntity
    {
        public BaseNameRepository(ModelContext context) : base(context) { }

        public async Task<IEnumerable<object>> GetAllByName(string name, int? limit, int? skip)
        {
            var query = _table.Where(x => name == null || x.Name.ToLower().Contains(name.ToLower())).OrderBy(x => x.Name);

            var orderedQuery = PaginationService<T>.SplitAndLimitQueryable(skip, limit, query);

            return await orderedQuery.ToListAsync();
        }

        public async Task<T> GetSingleByName(string name)
        {
            return await _table.Where(x => x.Name.ToLower() == name.ToLower()).FirstOrDefaultAsync();
        }

        public bool Exists(string name)
        {
            return _table.Any(x => x.Name.ToLower() == name.ToLower());
        }
    }
}
