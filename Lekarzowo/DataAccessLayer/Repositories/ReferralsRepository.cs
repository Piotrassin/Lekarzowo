using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using Lekarzowo.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories
{
    public class ReferralsRepository : BaseIdRepository<Referral>, IReferralsRepository
    {
        //private readonly ModelContext _context;

        public ReferralsRepository(ModelContext context) : base(context)
        {
            //_context = context;
        }
    }
}
