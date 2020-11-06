using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using Lekarzowo.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories
{
    public class CitiesRepository : BaseNamedRepository<City>, ICitiesRepository
    {
        public CitiesRepository(ModelContext context) : base(context) { }

        public bool Exists(City city)
        {
            return _context.City.Any(x => x.Name == city.Name);
        }
    }
}
