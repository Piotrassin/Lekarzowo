using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories.Interfaces
{
    public interface IMedicinesHistoryRepository
    {
        IEnumerable<Medicinehistory> GetAll();
        IEnumerable<Medicinehistory> GetAll(decimal IllnessHistoryId);
        Medicinehistory GetByID(decimal IllnessHistoryId, decimal MedicineId);
        void Insert(Medicinehistory t);
        void Delete(Medicinehistory t);
        void Update(Medicinehistory t);
        bool Exists(decimal IllnessHistoryId, decimal MedicineId);
        void Save();
    }
}
