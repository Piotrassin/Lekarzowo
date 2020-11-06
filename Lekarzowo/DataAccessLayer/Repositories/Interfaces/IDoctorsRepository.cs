using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using Lekarzowo.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories
{
    public interface IDoctorsRepository : IBaseRepository<Doctor>
    {
        Task<IEnumerable<object>> SearchByName(string name, string lastname);
        bool Exists(Doctor doctor);
    }
}
