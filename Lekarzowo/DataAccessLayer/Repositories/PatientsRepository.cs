using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using Lekarzowo.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories
{
    public class PatientsRepository : BaseIdRepository<Patient>, IPatientsRepository
    {
        private readonly ModelContext _context;

        public PatientsRepository(ModelContext context) : base(context)
        {
            _context = context;
        }
    }
}
