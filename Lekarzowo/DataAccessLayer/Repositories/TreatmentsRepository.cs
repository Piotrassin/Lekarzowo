using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using Lekarzowo.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories
{
    public class TreatmentsRepository : BaseNamedRepository<Treatment>, ITreatmentsRepository
    {
        public TreatmentsRepository(ModelContext context) : base (context) {}
    }
}
