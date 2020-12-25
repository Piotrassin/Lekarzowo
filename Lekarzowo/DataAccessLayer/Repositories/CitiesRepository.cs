using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;

namespace Lekarzowo.DataAccessLayer.Repositories
{
    public class CitiesRepository : BaseNameRepository<City>, ICitiesRepository
    {
        public CitiesRepository(ModelContext context) : base(context) { }

    }
}
