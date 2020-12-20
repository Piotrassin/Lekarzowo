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

        public IEnumerable<object> GetAll(decimal patientId)
        {
            return _context.Illnesshistory.Where(x => x.Visit.Reservation.PatientId == patientId)
                .Select(x => new
                {
                    Id = x.Id,
                    PatientId = x.Visit.Reservation.PatientId,
                    DoctorId = x.Visit.Reservation.DoctorId,
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

        public async Task<IEnumerable<Illnesshistory>> GetByVisitId(decimal visitId)
        {
            return await _context.Illnesshistory.Where(x => x.VisitId == visitId).ToListAsync();
        }

        public async Task<IEnumerable<object>> PatientHistory(decimal patientId, int? limit, int? skip)
        {
            var query = _context.Illnesshistory.Where(x => x.Visit.Reservation.PatientId == patientId)
                .Select(x => new
                {
                    IllnessHistoryId = x.Id,
                    IllnessName = x.Illness.Name,
                    DiagnoseDate = x.Visit.Reservation.Starttime,
                    CureDate = x.Curedate,
                    Description = x.Description
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
        public async Task<IEnumerable<object>> AllByNameOnVisit(decimal visitId, string name, int? limit, int? skip)
        {
            var query = _context.Illnesshistory
                .Where(x => x.VisitId == visitId)
                .Where(x => name == null || x.Illness.Name.ToLower().Contains(name.ToLower()))
                .Select(x => new
                {
                    PatientId = x.Visit.Reservation.PatientId,
                    IllnessHistoryId = x.Id,
                    IllnessName = x.Illness.Name
                }).OrderBy(x => x.IllnessName);

            IOrderedQueryable<object> orderedQuery = PaginationService<Illness>.SplitAndLimitQueryable(skip, limit, query);
            return await orderedQuery.ToListAsync();
        }
    }
}
