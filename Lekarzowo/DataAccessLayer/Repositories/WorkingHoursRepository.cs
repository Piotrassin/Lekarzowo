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


        public IEnumerable<Workinghours> GetAllFutureWorkHours(decimal? CityId, decimal? SpecId, decimal? DoctorId)
        {
            return _context.Workinghours
                .Include(x => x.Local)
                .Include(x => x.Doctor)
                .Where(x => x.From >= DateTime.Now)
                .Where(x => !CityId.HasValue || x.Local.CityId == CityId)
                .Where(x => !SpecId.HasValue || x.Doctor.SpecialityId == SpecId)
                .Where(x => !DoctorId.HasValue || x.DoctorId == DoctorId)
                .OrderBy(x => x.From)
                .ToList();
        }
    }
}
