using Lekarzowo.DataAccessLayer.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories.Interfaces
{
    public interface IRoomsRepository : IBaseIdRepository<Room>
    {
        /// <summary>
        /// Returns basic data from room and local objects.
        /// </summary>
        /// <param name="limit"></param>
        /// <param name="skip"></param>
        /// <returns></returns>
        Task<IEnumerable<object>> GetAllWithLocalData(int? limit, int? skip);

        /// <summary>
        /// Returns all rooms with a given LocalId.
        /// </summary>
        /// <param name="LocalId"></param>
        /// <returns></returns>
        Task<IEnumerable<Room>> GetAllByLocalId(decimal LocalId);

        /// <summary>
        /// Searches rooms in a given local with optional roomNumber property.
        /// </summary>
        /// <param name="localId"></param>
        /// <param name="roomNumber"></param>
        /// <returns></returns>
        Task<IEnumerable<Room>> AllByRoomNumber(decimal localId, decimal? roomNumber);

        /// <summary>
        /// Checks if a room with given local and room number exists. 
        /// </summary>
        /// <param name="room"></param>
        /// <returns></returns>
        Task<bool> Exists(Room room);
    }
}
