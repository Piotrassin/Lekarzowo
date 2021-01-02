using Lekarzowo.DataAccessLayer.Models;
using System.Collections.Generic;
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

        /// <summary>
        /// Checks if a room with given local and room number exists. 
        /// </summary>
        /// <param name="room"></param>
        /// <returns></returns>
        Task<bool> Exists(Room room);
    }
}
