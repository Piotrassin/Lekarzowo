using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories
{
    public class RoomsRepository : BaseIdRepository<Room>, IRoomsRepository
    {
        public RoomsRepository(ModelContext context) : base(context) { }


        public async Task<IEnumerable<Room>> GetAllByLocalId(decimal LocalId)
        {
            return await _context.Room.Where(r => r.LocalId == LocalId).ToListAsync();
        }

        public async Task<bool> Exists(Room room)
        {
            return await _context.Room.AnyAsync(x => x.Number == room.Number && x.LocalId == room.LocalId);
        }
    }
}
