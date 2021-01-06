using System.Linq;
using System.Threading.Tasks;
using Lekarzowo.DataAccessLayer.Models;
using Microsoft.EntityFrameworkCore;

namespace Lekarzowo.DataAccessLayer.Repositories
{
    public class LocalsRepository : BaseNameRepository<Local>, ILocalsRepository
    {
        public LocalsRepository(ModelContext context) : base(context) {}

        public async Task<Local> GetByIdWithCity(decimal localId)
        {
            return await _context.Local.Select(x => new Local()
            {
                Id = x.Id,
                CityId = x.CityId,
                Name = x.Name,
                Streetname = x.Streetname,
                Streetnumber = x.Streetnumber,
                Blocknumber = x.Blocknumber,
                Postcode = x.Postcode,
                City = new City()
                {
                    Id = x.CityId,
                    Name = x.City.Name,
                    Local = null
                }
            }).FirstOrDefaultAsync(x => x.Id == localId);
        }
    }
}
