using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using Lekarzowo.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Lekarzowo.Services;

namespace Lekarzowo.DataAccessLayer.Repositories
{
    public class WorkingHoursRepository : BaseIdRepository<Workinghours>, IWorkingHoursRepository
    {
        public WorkingHoursRepository(ModelContext context) : base(context) { }
        
        public async Task<Workinghours> GetByDetails(decimal DocId, decimal LocId, DateTime date)
        {
            return await _context.Workinghours.Where(x => x.From.Date == date || x.To.Date == date).FirstOrDefaultAsync(
                x => x.DoctorId == DocId
                && x.LocalId == LocId);
        }

        public async Task<IEnumerable<Local>> DoctorsWorkplaces(decimal doctorId)
        {
            var query = _context.Workinghours
                .Where(x => x.DoctorId == doctorId)
                .Where(x => x.From.Date >= DateTime.Now.Date)
                .Select(x => x.Local).Include(x => x.City)
                .Distinct()
                .OrderBy(x => x.City.Name)
                .ThenBy(x => x.Name);

            return await query.ToListAsync();
        }

        public async Task<IEnumerable<Workinghours>> DoctorUpcomingWorkingHours(decimal doctorId, decimal localId, int days)
        {
            var query = _context.Workinghours
                .Where(x => x.DoctorId == doctorId)
                .Where(x => x.LocalId == localId)
                .Where(x => x.From.Date >= DateTime.Now.Date)
                .Select(x => new Workinghours
                {
                    Id = x.Id,
                    From = x.From,
                    To = x.To,
                    DoctorId = x.DoctorId,
                    LocalId = x.LocalId
                })
                .OrderBy(x => x.From)
                .Take(days);

            return await query.ToListAsync();
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

        public async Task<IEnumerable<Workinghours>> IsWorkingHourOverlapping(Workinghours wh)
        {
            var query = _context.Workinghours
                .Where(x => x.LocalId == wh.LocalId)
                .Where(x => x.DoctorId == wh.DoctorId)
                .Where(x => x.From.Date == wh.From.Date || x.To.Date == wh.To.Date)
                .Where(x => (x.To > wh.From && x.To <= wh.To) || (x.From >= wh.From && x.From < wh.To) || (x.From < wh.From && x.To > wh.To));

            return await query.ToListAsync();
        }

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
