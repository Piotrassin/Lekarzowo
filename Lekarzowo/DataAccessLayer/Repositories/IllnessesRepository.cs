using Lekarzowo.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories
{
    public class IllnessesRepository : GenericRepository<Illness>, IIllnessesRepository
    {
        private readonly ModelContext _context;

        public IllnessesRepository(ModelContext context) : base(context)
        {
            this._context = context;
        }
    }
}
