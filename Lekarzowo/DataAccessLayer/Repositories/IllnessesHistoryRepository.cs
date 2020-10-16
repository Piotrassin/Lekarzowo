using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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
    }
}
