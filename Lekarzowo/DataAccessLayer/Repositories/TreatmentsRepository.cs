using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;

namespace Lekarzowo.DataAccessLayer.Repositories
{
    public class TreatmentsRepository : BaseNameRepository<Treatment>, ITreatmentsRepository
    {
        public TreatmentsRepository(ModelContext context) : base (context) {}
    }
}
