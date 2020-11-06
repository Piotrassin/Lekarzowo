using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using Lekarzowo.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.Repositories
{
    public interface IPeopleRepository : IBaseNamedEntityRepository<Person>
    {
        Person GetByEmail(string email);
        void Dispose(bool disposing);
        void Dispose();
    }
}
