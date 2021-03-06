﻿using Lekarzowo.DataAccessLayer.Models;
using System.Collections.Generic;
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

        /// <summary>
        /// Returns objects with partial and specific odlIllnessHistory data used to different endpoint.
        /// </summary>
        /// <param name="PatientId"></param>
        /// <returns></returns>
        Task<IEnumerable<object>> GetAllSpecificData(decimal PatientId);
    }
}
