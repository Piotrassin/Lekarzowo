using Lekarzowo.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories.Interfaces
{
    public interface IOldIllnessesHistoryRepository
    {
        Task<IEnumerable<Oldillnesshistory>> GetAll();
        Task<IEnumerable<Oldillnesshistory>> GetAll(decimal PatientId);
        Task<Oldillnesshistory> GetByID(decimal IllnessId, decimal PatientId);
        Task Insert(Oldillnesshistory t);
        void Delete(Oldillnesshistory t);
        void Update(Oldillnesshistory t);
        Task<bool> Exists(decimal IllnessId, decimal PatientId);
        Task Save();
    }
}
