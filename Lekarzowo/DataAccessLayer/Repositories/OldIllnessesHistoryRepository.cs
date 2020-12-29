using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories
{
    public class OldIllnessesHistoryRepository : IOldIllnessesHistoryRepository
    {
        private readonly ModelContext _context;

        public OldIllnessesHistoryRepository(ModelContext context)
        {
            _context = context;
        }


        public void Delete(Oldillnesshistory t)
        {
            _context.Oldillnesshistory.Remove(t);
        }

        public async Task<bool> Exists(decimal IllnessId, decimal PatientId)
        {
            return await _context.Oldillnesshistory.AnyAsync(x => x.IllnessId == IllnessId && x.PatientId == PatientId);
        }

        public async Task<IEnumerable<Oldillnesshistory>> GetAll()
        {
            return await _context.Oldillnesshistory.ToListAsync();
        }

        public async Task<IEnumerable<Oldillnesshistory>> GetAll(decimal PatientId)
        {
            return await _context.Oldillnesshistory.Where(x => x.PatientId == PatientId).OrderBy(x => x.Date).ToListAsync();
        }

        public async Task<IEnumerable<object>> GetAllSpecificData(decimal PatientId)
        {
            return await _context.Oldillnesshistory
                .Where(x => x.PatientId == PatientId)
                .Select(x => new
            {
                    cureDate = x.Curedate,
                    description = x.Description,
                    diagnoseDate = x.Date,
                    illnessName = x.Illness.Name
            }).OrderBy(x => x.diagnoseDate).ToListAsync();
        }

        public async Task<Oldillnesshistory> GetByID(decimal IllnessId, decimal PatientId)
        {
            return await _context.Oldillnesshistory.FirstOrDefaultAsync(x => x.IllnessId == IllnessId && x.PatientId == PatientId);
        }

        public async Task Insert(Oldillnesshistory t)
        {
            await _context.Oldillnesshistory.AddAsync(t);
        }

        public async Task Save()
        {
            await _context.SaveChangesAsync();
        }

        public void Update(Oldillnesshistory t)
        {
            _context.Oldillnesshistory.Attach(t);
            _context.Entry(t).State = EntityState.Modified;
        }
    }
}
