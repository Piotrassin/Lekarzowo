using Lekarzowo.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories.Interfaces
{
    public interface ICitiesRepository : IBaseNamedEntityRepository<City>
    {
        bool Exists(City city);
    }
}
