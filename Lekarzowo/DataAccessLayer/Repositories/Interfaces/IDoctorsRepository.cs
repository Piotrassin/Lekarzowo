using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using System.Collections.Generic;
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
        /// Returns a doctor with a given Id along with it's speciality/specialization info.
        /// </summary>
        /// <param name="doctorId"></param>
        /// <returns></returns>

        Task<Doctor> GetByIdWithSpecialization(decimal doctorId);
        /// <summary>
        /// Returns a list of doctors which names and/or lastnames contains given phrase
        /// </summary>
        /// <param name="name"></param>
        /// <param name="skip"></param>
        /// <param name="limit"></param>
        /// <returns></returns>
        Task<IEnumerable<object>> GetAllByNameOrLastname(string name, int? limit, int? skip);
    }
}
