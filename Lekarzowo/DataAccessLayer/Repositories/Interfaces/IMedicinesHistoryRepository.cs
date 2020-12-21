﻿using System;
using Lekarzowo.DataAccessLayer.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories.Interfaces
{
    public interface IMedicinesHistoryRepository : IBaseCRUDRepository<Medicinehistory>
    {
        new IEnumerable<Medicinehistory> GetAll();
        IEnumerable<Medicinehistory> GetAll(decimal IllnessHistoryId);
        Medicinehistory GetById(decimal IllnessHistoryId, decimal MedicineId, DateTime startDate);

        /// <summary>
        /// All medicines currently taken by the given patient.
        /// </summary>
        /// <param name="patientId"></param>
        /// <param name="limit"></param>
        /// <param name="skip"></param>
        /// <returns></returns>
        Task<IEnumerable<object>> TakenMedicines(decimal patientId, int? limit, int? skip);

        /// <summary>
        /// Medicines prescribed during given visit
        /// </summary>
        /// <param name="visitId"></param>
        /// <param name="limit"></param>
        /// <param name="skip"></param>
        /// <returns></returns>
        Task<IEnumerable<object>> PrescribedMedicines(decimal visitId, int? limit, int? skip);

        void Update(Medicinehistory t);
        bool Exists(decimal IllnessHistoryId, decimal MedicineId);
    }
}
