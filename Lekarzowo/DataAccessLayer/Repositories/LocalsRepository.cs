using System.Linq;
using System.Threading.Tasks;
using Lekarzowo.DataAccessLayer.Models;
using Microsoft.EntityFrameworkCore;

namespace Lekarzowo.DataAccessLayer.Repositories
{
    public class LocalsRepository : BaseNameRepository<Local>, ILocalsRepository
    {
        public LocalsRepository(ModelContext context) : base(context) {}

    }
}
