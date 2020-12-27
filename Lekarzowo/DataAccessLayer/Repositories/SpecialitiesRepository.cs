using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;

namespace Lekarzowo.DataAccessLayer.Repositories
{
    public class SpecialitiesRepository : BaseNameRepository<Speciality>, ISpecialitiesRepository
    {
        public SpecialitiesRepository(ModelContext context) : base(context) {}
    }
}
