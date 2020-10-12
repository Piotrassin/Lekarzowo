using Lekarzowo.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories
{
    public class MedicineRepository : BaseRepository<Medicine>, IMedicineRepository
    {
        private readonly ModelContext _context;
        public MedicineRepository(ModelContext context) : base(context)
        {
            _context = context;
        }

        public bool Exists(Medicine t)
        {
            throw new NotImplementedException();
        }
    }
}
