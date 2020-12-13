using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories.Interfaces
{
    public interface IBaseCRUDRepository<T> where T : class
    {
        IEnumerable<T> GetAll();
        void Insert(T t);
        void Delete(T t);
        void Update(T t, T entry);
        void Save();
    }
}
