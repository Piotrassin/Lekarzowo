using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using Lekarzowo.Services;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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

        public async Task<IEnumerable<object>> DoctorsWorkplacesByName(string localName, decimal? doctorId, int? limit, int? skip)
        {
            var query = _context.Workinghours
                .Where(x => !doctorId.HasValue || x.DoctorId == doctorId)
                .Where(x => localName == null || x.Local.Name.ToLower().Contains(localName.ToLower()))
                .Where(x => x.From.Date >= DateTime.Now.Date)
                .Select(x => x.Local).Include(x => x.City)
                .Distinct()
                .OrderBy(x => x.City.Name)
                .ThenBy(x => x.Name);

            var orderedQuery = PaginationService<Local>.SplitAndLimitQueryable(skip, limit, query);

            return await orderedQuery.ToListAsync();
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
                query = query.Where(x => x.From.Date >= start.Value.Date);
            }
            else
            {
                query = query.Where(x => x.From.Date >= DateTime.Now.Date);
            }

            if (end.HasValue)
            {
                query = query.Where(x => x.From.Date <= end.Value.Date);
            }

            return query.OrderBy(x => x.From).ToList();
        }

        public async Task<IEnumerable<Workinghours>> IsWorkingHourOverlapping(Workinghours newHours)
        {
            var query = _context.Workinghours
                .Where(existing => existing.LocalId == newHours.LocalId)
                .Where(existing => existing.DoctorId == newHours.DoctorId)
                .Where(existing => existing.From.Date == newHours.From.Date || existing.To.Date == newHours.To.Date)
                .Where(existing => (existing.To > newHours.From && existing.To <= newHours.To)
                                   || (existing.From >= newHours.From && existing.From < newHours.To) 
                                   || (existing.From < newHours.From && existing.To > newHours.To));

            return await query.ToListAsync();
        }

        public async Task<IEnumerable<object>> AutoCompleteInfo(string date, decimal? doctorId, decimal? localId, int? limit, int? skip)
        {
            var query = _context.Workinghours
                .Where(x => !doctorId.HasValue || x.DoctorId == doctorId)
                .Where(x => !localId.HasValue || x.LocalId == localId)
                .Where(x => date == null || x.From.Date.ToString().Contains(date))
                .OrderBy(x => x.From)
                .Select(x => new
                {
                    id = x.Id,
                    name = x.Local.Name + " " + 
                           x.From.Date.ToString("dd/MM/yyyy") + ", " +
                           x.From.ToString("HH:mm") + " - " +
                           x.To.ToString("HH:mm")
                });

            var trimmedQuery = PaginationService<object>.SplitAndLimitQueryable(skip, limit, (IOrderedQueryable<object>) query);

            return await trimmedQuery.ToListAsync();
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
