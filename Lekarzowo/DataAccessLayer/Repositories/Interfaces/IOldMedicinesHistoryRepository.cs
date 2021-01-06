using System;
using Lekarzowo.DataAccessLayer.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories.Interfaces
{
    public interface IOldMedicinesHistoryRepository
    {
        Task<IEnumerable<Oldmedicinehistory>> GetAll(int? limit, int? skip);

        /// <summary>
        /// Used by another endpoint. Gathers all oldmedicines of a given patient in a list
        /// </summary>
        /// <param name="PatientId"></param>
        /// <returns></returns>
        Task<IEnumerable<Oldmedicinehistory>> GetAll(decimal PatientId);
        Task<Oldmedicinehistory> GetByID(decimal MedicineId, decimal PatientId, DateTime date);
        Task Insert(Oldmedicinehistory t);
        void Delete(Oldmedicinehistory t);
        void Update(Oldmedicinehistory t);
        Task<bool> Exists(decimal MedicineId, decimal PatientId, DateTime date);
        Task Save();
    }
}
