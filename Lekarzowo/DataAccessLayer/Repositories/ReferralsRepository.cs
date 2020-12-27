using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;

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
