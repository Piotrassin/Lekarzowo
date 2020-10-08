using Lekarzowo.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories
{
    public class IllnessesHistoryRepository : GenericRepository<Illnesshistory>, IIllnessesHistoryRepository
    {
        private readonly ModelContext _context;

        public IllnessesHistoryRepository(ModelContext context) : base(context)
        {
            this._context = context;
        }
    }
}
