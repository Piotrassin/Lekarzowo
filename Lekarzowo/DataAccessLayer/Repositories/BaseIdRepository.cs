using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using System.Collections.Generic;
using System.Linq;

namespace Lekarzowo.DataAccessLayer.Repositories
{
    public class BaseIdRepository<T> : BaseCRUDRepository<T>, IBaseIdRepository<T> where T : class, IEntity
    {
        public BaseIdRepository(ModelContext context) : base(context) { }

        public new IEnumerable<T> GetAll()
        {
            return _table.ToList().OrderBy(x => x.Id);
        }

        public T GetByID(decimal id)
        {
            return _table.Find(id);
        }

        public void Update(T t)
        {
            var entry = _table.First(e => e.Id == t.Id);
            Update(t, entry);
        }

        public bool Exists(decimal Id)
        {
            return _table.Any(x => x.Id == Id);
        }

    }
}
