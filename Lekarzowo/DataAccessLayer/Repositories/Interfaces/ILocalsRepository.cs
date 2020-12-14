using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using Lekarzowo.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories
{
    public interface ILocalsRepository : IBaseNameRepository<Local>
    {
        /// <summary>
        /// Returns a list of locals in which a given doctor has working hours in upcoming days
        /// </summary>
        /// <param name="doctorId"></param>
        /// <param name="days"></param>
        /// <param name="limit"></param>
        /// <param name="skip"></param>
        /// <returns></returns>
        Task<IEnumerable<Local>> DoctorsWorkplaces(decimal doctorId, int days, int? limit, int? skip);
    }
}
