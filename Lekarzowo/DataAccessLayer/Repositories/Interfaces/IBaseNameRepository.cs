using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories.Interfaces
{
    public interface IBaseNameRepository<T> : IBaseIdRepository<T> where T : class
    {
        /// <summary>
        /// Returns a list of objects which name attributes contain given name string.
        /// </summary>
        /// <param name="name"></param>
        /// <param name="limit"></param>
        /// <param name="skip"></param>
        /// <returns></returns>
        Task<IEnumerable<object>> GetAllByName(string name, int? limit, int? skip);

        /// <summary>
        /// Returns the first object with a given name or null.
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        Task<T> GetSingleByName(string name);

        /// <summary>
        /// Returns true if an object with a given name exists in a database.
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        bool Exists(string name);
    }
}
