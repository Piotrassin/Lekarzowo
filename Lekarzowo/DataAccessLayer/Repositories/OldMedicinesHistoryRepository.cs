using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories
{
    public class OldMedicinesHistoryRepository : IOldMedicinesHistoryRepository
    {
        private readonly ModelContext _context;

        public OldMedicinesHistoryRepository(ModelContext context)
        {
            _context = context;
        }


        public void Delete(Oldmedicinehistory t)
        {
            _context.Oldmedicinehistory.Remove(t);
        }

        public async Task<bool> Exists(decimal MedicineId, decimal PatientId)
        {
            return await _context.Oldmedicinehistory.AnyAsync(x => x.MedicineId == MedicineId && x.PatientId == PatientId);
        }

        public async Task<IEnumerable<Oldmedicinehistory>> GetAll()
        {
            return await _context.Oldmedicinehistory.ToListAsync();
        }

        public async Task<IEnumerable<Oldmedicinehistory>> GetAll(decimal PatientId)
        {
            return await _context.Oldmedicinehistory.Where(x => x.PatientId == PatientId).ToListAsync();
        }

        public async Task<Oldmedicinehistory> GetByID(decimal MedicineId, decimal PatientId)
        {
            return await _context.Oldmedicinehistory.FirstOrDefaultAsync(x => x.MedicineId == MedicineId && x.PatientId == PatientId);
        }

        public async Task Insert(Oldmedicinehistory t)
        {
            await _context.Oldmedicinehistory.AddAsync(t);
        }

        public async Task Save()
        {
            await _context.SaveChangesAsync();
        }

        public void Update(Oldmedicinehistory t)
        {
            _context.Oldmedicinehistory.Attach(t);
            _context.Entry(t).State = EntityState.Modified;
        }
    }
}
