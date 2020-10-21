using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories
{
    public class CitiesRepository : BaseRepository<City>, ICitiesRepository
    {
        private readonly ModelContext _context;
        public CitiesRepository(ModelContext context) : base(context)
        {
            _context = context;
        }

        public bool Exists(City city)
        {
            return _context.City.Any(x => x.Name == city.Name);
        }
    }
}
