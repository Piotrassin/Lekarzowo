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


        public IEnumerable<Workinghours> GetAllFutureWorkHours(decimal? CityId, decimal? SpecId, decimal? DoctorId, DateTime? start, DateTime? end)
        {
            var query = _context.Workinghours
                .Include(x => x.Local)
                .Include(x => x.Doctor)
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
    }
}
