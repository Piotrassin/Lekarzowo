using Lekarzowo.DataAccessLayer.Models;

namespace Lekarzowo.DataAccessLayer.Repositories
{
    public class LocalsRepository : BaseNameRepository<Local>, ILocalsRepository
    {
        public LocalsRepository(ModelContext context) : base(context) {}

    }
}
