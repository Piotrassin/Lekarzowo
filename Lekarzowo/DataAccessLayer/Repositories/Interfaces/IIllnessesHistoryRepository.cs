using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using Lekarzowo.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories
{
    public interface IIllnessesHistoryRepository : IBaseRepository<Illnesshistory>
    {
        IEnumerable<Illnesshistory> GetAll(decimal PatientId);
        bool Exists(Illnesshistory illnesshistory);
    }
}
