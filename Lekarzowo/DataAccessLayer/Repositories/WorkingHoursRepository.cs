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
    public class WorkingHoursRepository : BaseRepository<Workinghours>, IWorkingHoursRepository
    {
        public WorkingHoursRepository(ModelContext context) : base(context) { }
        
        public async Task<Workinghours> GetByDetails(decimal DocId, decimal LocId, DateTime date)
        {
            return await _context.Workinghours.FirstOrDefaultAsync(
                x => x.DoctorId == DocId
                && x.LocalId == LocId
                && x.From.Date == date);
        }

        public IEnumerable<Workinghours> GetAllFutureWorkHours(decimal? CityId, decimal? SpecId, decimal? DoctorId, DateTime? start, DateTime? end)
        {
            var query = _context.Workinghours
                .Include(x => x.Local)
                .Include(x => x.Doctor).ThenInclude(x => x.Speciality)
                .Include(x => x.Doctor).ThenInclude(x => x.IdNavigation)
                .Where(x => !CityId.HasValue || x.Local.CityId == CityId)
                .Where(x => !SpecId.HasValue || x.Doctor.SpecialityId == SpecId)
                .Where(x => !DoctorId.HasValue || x.DoctorId == DoctorId);

            if (start.HasValue && start.Value.Date > DateTime.Now.Date)
            {
                query = query.Where(x => x.From >= start.Value.Date);
            }
            else
            {
                query = query.Where(x => x.From >= DateTime.Now);
            }

            if (end.HasValue)
            {
                query = query.Where(x => x.From <= end.Value.Date);
            }

            return query.OrderBy(x => x.From).ToList();
        }

        /// <summary>
        /// TODO: Powinno dać się pracować w różnych miejscach tego samego dnia.
        /// 3 przypadki (
        /// (A kończy się po ropzpoczęciu B), 
        /// (A zaczyna się przed końcem B), 
        /// (A zaczyna się przed końcem B i  kończy się po ropzpoczęciu B))
        /// </summary>
        /// <param name="wh"></param>
        /// <returns></returns>
        public async Task<bool> Exists(Workinghours wh)
        {
            return await _context.Workinghours.AnyAsync(
                x => x.LocalId == wh.LocalId
                && x.From.Date == wh.From.Date
                && x.To.Date == wh.To.Date
                && x.DoctorId == wh.DoctorId);
        }
        
    }
}
