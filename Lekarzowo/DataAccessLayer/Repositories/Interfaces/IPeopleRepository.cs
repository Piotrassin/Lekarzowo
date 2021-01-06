using Lekarzowo.DataAccessLayer.DTO;
using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Lekarzowo.Repositories
{
    public interface IPeopleRepository : IBaseNameRepository<Person>
    {
        Person GetByEmail(string email);

        /// <summary>
        /// Returns all people with included standard role info.
        /// </summary>
        /// <returns></returns>
        Task<IEnumerable<object>> GetAllWithRoles(int? limit, int? skip);
        Person GetSingleByEmailWithRoles(string email);
        void Insert(PersonRegistrationDTO personDTO);
        void Dispose(bool disposing);
        void Dispose();
        bool Exists(string email);
        Task<IEnumerable<object>> GetAllByNameOrLastname(string name, int? limit, int? skip);
    }
}
