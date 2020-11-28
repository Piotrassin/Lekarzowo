using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using Lekarzowo.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories
{
    public class RoomsRepository : BaseRepository<Room>, IRoomsRepository
    {
        public RoomsRepository(ModelContext context) : base(context)
        {

        }

        public async Task<Room> GetFullAddress(decimal RoomId)
        {
            return await _context.Room.FirstOrDefaultAsync(r => r.Id == RoomId);
        }
    }
}
