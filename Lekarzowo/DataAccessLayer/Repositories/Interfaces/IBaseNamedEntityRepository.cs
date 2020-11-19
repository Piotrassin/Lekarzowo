using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories.Interfaces
{
    public interface IBaseNamedEntityRepository<T> : IBaseRepository<T> where T : class
    {
        Task<IEnumerable<T>> GetAllByName(string name, int? limit, int? skip);
        Task<T> GetSingleByName(string name);
    }
}
