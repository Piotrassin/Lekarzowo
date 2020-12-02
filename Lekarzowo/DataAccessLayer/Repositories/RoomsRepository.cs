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
        public RoomsRepository(ModelContext context) : base(context) { }


        public async Task<IEnumerable<Room>> GetAllByLocalId(decimal LocalId)
        {
            return await _context.Room.Where(r => r.LocalId == LocalId).ToListAsync();
        }
    }
}
