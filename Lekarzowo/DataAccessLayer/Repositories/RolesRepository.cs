using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;

namespace Lekarzowo.DataAccessLayer.Repositories
{
    public class RolesRepository : BaseNameRepository<Role>, IRolesRepository
    {
        public RolesRepository(ModelContext context) : base(context)
        {

        }
    }
}
