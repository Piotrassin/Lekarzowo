using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Lekarzowo.Services;

namespace Lekarzowo.DataAccessLayer.Repositories
{
    public class IllnessesHistoryRepository : BaseRepository<Illnesshistory>, IIllnessesHistoryRepository
    {
        private readonly ModelContext _context;

        public IllnessesHistoryRepository(ModelContext context) : base(context)
        {
            this._context = context;
        }

        public IEnumerable<Illnesshistory> GetAll(decimal PatientId)
        {
            return _context.Illnesshistory.Where(x => x.PatientId == PatientId).ToList();
        }

        public bool Exists(Illnesshistory illnesshistory)
        {
            return _context.Illnesshistory.Any(x =>
                x.PatientId == illnesshistory.PatientId &&
                x.IllnessId == illnesshistory.IllnessId &&
                x.VisitId == illnesshistory.VisitId);
        }

        public async Task<IEnumerable<object>> IllnessesHistory(decimal patientId, int? limit, int? skip)
        {
            var query = _context.Illnesshistory.Where(x => x.PatientId == patientId)
                .Select(x => new
                {
                    IllnessName = x.Illness.Name,
                    DiagnoseDate = x.Visit.Reservation.Starttime,
                    CureDate = x.Curedate
                })
                .OrderBy(x => x.DiagnoseDate);

            var orderedQuery = PaginationService<object>.SplitAndLimitQueryable(skip, limit, query);

            return await orderedQuery.ToListAsync();
        }
    }
}
