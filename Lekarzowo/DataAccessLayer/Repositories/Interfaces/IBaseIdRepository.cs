using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories.Interfaces
{
    public interface IBaseIdRepository<T> : IBaseCRUDRepository<T> where T : class
    {
        IEnumerable<T> GetAll();
        T GetByID(decimal id);
        void Update(T t);
        bool Exists(decimal Id);
    }
}
