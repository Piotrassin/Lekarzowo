using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories.Interfaces
{
    public interface IOldMedicinesHistoryRepository
    {
        Task<IEnumerable<Oldmedicinehistory>> GetAll();
        Task<IEnumerable<Oldmedicinehistory>> GetAll(decimal PatientId);
        Task<Oldmedicinehistory> GetByID(decimal MedicineId, decimal PatientId);
        Task Insert(Oldmedicinehistory t);
        void Delete(Oldmedicinehistory t);
        void Update(Oldmedicinehistory t);
        Task<bool> Exists(decimal MedicineId, decimal PatientId);
        Task Save();
    }
}
