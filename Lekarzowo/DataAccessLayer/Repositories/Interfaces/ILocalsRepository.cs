using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using Lekarzowo.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories
{
    public interface ILocalsRepository : IBaseNamedEntityRepository<Local>
    {
        bool Exists(Local local);
        //Task<IEnumerable<View_AddressData>> DetailsView(decimal RoomId);

        /// <summary>
        /// Returns a list of locals in which a given doctor has working hours in db.
        /// </summary>
        /// <param name="doctorId"></param>
        /// <param name="limit"></param>
        /// <param name="skip"></param>
        /// <returns></returns>
        Task<IEnumerable<Local>> DoctorsWorkplaces(decimal doctorId, int? limit, int? skip);
    }
}
