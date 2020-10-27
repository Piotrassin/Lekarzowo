using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories
{
    public class IllnessesRepository : BaseRepository<Illness>, IIllnessesRepository
    {
        private readonly ModelContext _context;

        public IllnessesRepository(ModelContext context) : base(context)
        {
            this._context = context;
        }

        public bool Exists(Illness illness)
        {
            return _context.Illness.Any(x => x.Name == illness.Name);
        }
    }
}
