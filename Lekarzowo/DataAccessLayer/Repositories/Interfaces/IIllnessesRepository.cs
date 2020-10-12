using Lekarzowo.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories
{
    public interface IIllnessesRepository : IBaseRepository<Illness>
    {
        bool Exists(Illness illness);
    }
}
