using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.Services;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories
{
    public class IllnessesHistoryRepository : BaseIdRepository<Illnesshistory>, IIllnessesHistoryRepository
    {
        public IllnessesHistoryRepository(ModelContext context) : base(context) {}

        public IEnumerable<Illnesshistory> GetAll(decimal PatientId)
        {
            return _context.Illnesshistory.Where(x => x.PatientId == PatientId)
                .Select(x => new Illnesshistory
                {
                    Id = x.Id,
                    PatientId = x.PatientId,
                    VisitId = x.VisitId,
                    Curedate = x.Curedate,
                    Description = x.Description,
                    Illness = new Illness
                    {
                        Id = x.Illness.Id,
                        Name = x.Illness.Name
                    }
                }).ToList();
        }

        public bool Exists(Illnesshistory illnesshistory)
        {
            return _context.Illnesshistory.Any(x =>
                x.PatientId == illnesshistory.PatientId &&
                x.IllnessId == illnesshistory.IllnessId &&
                x.VisitId == illnesshistory.VisitId);
        }

        public async Task<IEnumerable<object>> AllByPatientId(decimal patientId, int? limit, int? skip)
        {
            var query = _context.Illnesshistory.Where(x => x.PatientId == patientId)
                .Select(x => new
                {
                    IllnessHistoryId = x.Id,
                    IllnessName = x.Illness.Name,
                    DiagnoseDate = x.Visit.Reservation.Starttime,
                    CureDate = x.Curedate
                })
                .OrderBy(x => x.DiagnoseDate);

            var orderedQuery = PaginationService<object>.SplitAndLimitQueryable(skip, limit, query);

            return await orderedQuery.ToListAsync();
        }

        public async Task<IEnumerable<object>> AllByVisitId(decimal visitId, int? limit, int? skip)
        {
            var query = _context.Illnesshistory.Where(x => x.VisitId == visitId)
                .Select(x => new
                {
                    IllnessHistoryId = x.Id,
                    IllnessName = x.Illness.Name,
                    DiagnoseDate = x.Visit.Reservation.Starttime,
                    CureDate = x.Curedate
                })
                .OrderBy(x => x.IllnessName);

            var orderedQuery = PaginationService<object>.SplitAndLimitQueryable(skip, limit, query);

            return await orderedQuery.ToListAsync();
        }
    }
}
