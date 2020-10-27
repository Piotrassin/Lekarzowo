using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using Lekarzowo.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories
{
    public class TreatmentsOnVisitRepository : BaseRepository<Treatmentonvisit>, ITreatmentsOnVisitRepository
    {
        public TreatmentsOnVisitRepository(ModelContext context) : base(context)
        { 

        }
    }
}
