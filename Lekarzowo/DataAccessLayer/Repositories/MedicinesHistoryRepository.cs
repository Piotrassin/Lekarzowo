using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using Lekarzowo.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories
{
    public class MedicinesHistoryRepository : IMedicinesHistoryRepository
    {
        private readonly ModelContext _context;
        public MedicinesHistoryRepository(ModelContext context)
        {
            _context = context;
        }

        public void Delete(Medicinehistory t)
        {
            _context.Medicinehistory.Remove(t);
        }

        public bool Exists(decimal IllnessHistoryId, decimal MedicineId)
        {
            return _context.Medicinehistory.Any(x => x.IllnesshistoryId == IllnessHistoryId && x.MedicineId == MedicineId);
        }

        public IEnumerable<Medicinehistory> GetAll()
        {
            return _context.Medicinehistory.ToList();
        }

        public IEnumerable<Medicinehistory> GetAll(decimal IllnessHistoryId)
        {
            return _context.Medicinehistory.Where(x => x.IllnesshistoryId == IllnessHistoryId).ToList();
        }

        public Medicinehistory GetByID(decimal IllnessHistoryId, decimal MedicineId)
        {
            return _context.Medicinehistory.FirstOrDefault(x => x.IllnesshistoryId == IllnessHistoryId && x.MedicineId == MedicineId);
        }

        public void Insert(Medicinehistory t)
        {
            _context.Medicinehistory.Add(t);
        }

        public void Save()
        {
            _context.SaveChanges();
        }

        public void Update(Medicinehistory t)
        {
            _context.Medicinehistory.Attach(t);
            _context.Entry(t).State = EntityState.Modified;
        }
    }
}
