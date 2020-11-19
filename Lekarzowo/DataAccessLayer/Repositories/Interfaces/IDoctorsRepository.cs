using Lekarzowo.DataAccessLayer.Models;
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
        Task<IEnumerable<object>> GetAllByName(string name, int? skip, int? limit);
        bool Exists(Doctor doctor);
    }
}
