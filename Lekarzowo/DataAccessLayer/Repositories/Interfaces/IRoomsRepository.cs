using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories.Interfaces
{
    public interface IRoomsRepository : IBaseIdRepository<Room>
    {
        /// <summary>
        /// Returns all rooms with a given LocalId.
        /// </summary>
        /// <param name="LocalId"></param>
        /// <returns></returns>
        Task<IEnumerable<Room>> GetAllByLocalId(decimal LocalId);
    }
}
