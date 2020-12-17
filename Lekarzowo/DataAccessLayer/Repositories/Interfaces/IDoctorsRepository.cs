using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using Lekarzowo.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories
{
    public interface IDoctorsRepository : IBaseIdRepository<Doctor>
    {
        /// <summary>
        /// Returns basic contact data for a given doctor
        /// </summary>
        /// <param name="doctorId"></param>
        /// <returns></returns>
        object DoctorsContactData(decimal doctorId);

        /// <summary>
        /// Returns a list of doctors which names and/or lastnames contains given phrase
        /// </summary>
        /// <param name="name"></param>
        /// <param name="skip"></param>
        /// <param name="limit"></param>
        /// <returns></returns>
        Task<IEnumerable<object>> GetAllByNameOrLastname(string name, int? skip, int? limit);
    }
}
