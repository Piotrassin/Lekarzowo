using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.Services;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories
{
    public class IllnessesRepository : BaseNameRepository<Illness>, IIllnessesRepository
    {
        public IllnessesRepository(ModelContext context) : base(context) {}

    }
}
