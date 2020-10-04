using Lekarzowo.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories
{
    public class IllnessRepository : GenericRepository<Illness>, IIllnessRepository
    {
        private readonly ModelContext _context;

        public IllnessRepository(ModelContext context) : base(context)
        {
            this._context = context;
        }
    }
}
