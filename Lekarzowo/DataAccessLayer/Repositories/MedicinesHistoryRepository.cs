using System;
using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using Lekarzowo.Services;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories
{
    public class MedicinesHistoryRepository : BaseCRUDRepository<Medicinehistory>, IMedicinesHistoryRepository
    {
        public MedicinesHistoryRepository(ModelContext context) : base(context) { }

        public bool Exists(decimal illnessHistoryId, decimal medicineId, DateTime startDate)
        {
            return _context.Medicinehistory.Any(x => x.IllnesshistoryId == illnessHistoryId && x.MedicineId == medicineId && x.Startdate == startDate);
        }
        public async Task<bool> Exists(decimal illnessHistoryId)
        {
            return await _context.Medicinehistory.AnyAsync(x => x.IllnesshistoryId == illnessHistoryId);
        }

        public new IEnumerable<Medicinehistory> GetAll()
        {
            return _context.Medicinehistory.ToList().OrderBy(x => x.Startdate);
        }

        public IEnumerable<Medicinehistory> GetAll(decimal illnessHistoryId)
        {
            return _context.Medicinehistory.Where(x => x.IllnesshistoryId == illnessHistoryId).ToList();
        }

        public Medicinehistory GetById(decimal illnessHistoryId, decimal medicineId, DateTime startDate)
        {
            return _context.Medicinehistory.FirstOrDefault(x => x.IllnesshistoryId == illnessHistoryId && x.MedicineId == medicineId && x.Startdate.Date == startDate.Date);
        }

        public void Update(Medicinehistory t)
        {
            var entry = _table.First(e => e.IllnesshistoryId == t.IllnesshistoryId && e.MedicineId == t.MedicineId);
            Update(t, entry);
        }

        public async Task<IEnumerable<object>> TakenMedicines(decimal patientId, int? limit, int? skip)
        {
            var query = _context.Medicinehistory
                .Where(x => x.Illnesshistory.Visit.Reservation.PatientId == patientId)
                .Where(x => x.Finishdate == null || x.Finishdate >= DateTime.Now.Date)
                .Select(x => new
                {
                    medicineName = x.Medicine.Name,
                    medicineDosage = x.Description,
                    illnesshistoryId = x.IllnesshistoryId,
                    medicineId = x.MedicineId,
                    startdate = x.Startdate,
                    finishdate = x.Finishdate,
                    description = x.Description
                }).OrderBy(x => x.medicineName).ThenBy(x => x.finishdate == null).ThenBy(x => x.finishdate);

            var orderedQuery = PaginationService<object>.SplitAndLimitQueryable(skip, limit, query);

            return await orderedQuery.ToListAsync();
        }

        public async Task<IEnumerable<object>> PrescribedMedicines(decimal visitId, int? limit, int? skip)
        {
            var query = _context.Medicinehistory.Where(x => x.Illnesshistory.VisitId == visitId)
                .Select(x => new
                {
                    medicineName = x.Medicine.Name,
                    medicineDosage = x.Description,
                    medicineId = x.MedicineId,
                    illnessHistoryId = x.IllnesshistoryId,
                    startDate = x.Startdate,
                    description = x.Description
                }).OrderBy(x => x.startDate).ThenBy(x => x.medicineName);

            var orderedQuery = PaginationService<object>.SplitAndLimitQueryable(skip, limit, query);

            return await orderedQuery.ToListAsync();
        }
    }
}
