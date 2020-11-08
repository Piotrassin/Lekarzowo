using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using Lekarzowo.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories
{
    public class WorkingHoursRepository : BaseRepository<Workinghours>, IWorkingHoursRepository
    {
        public WorkingHoursRepository(ModelContext context) : base(context) { }

        public IEnumerable<Workinghours> GetAllFutureWorkHours()
        {
            return _context.Workinghours.Where(x => x.From >= DateTime.Now).ToList();
        }
    }
}
