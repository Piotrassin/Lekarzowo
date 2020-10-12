using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories
{
    public class MedicinesRepository : BaseRepository<Medicine>, IMedicinesRepository
    {
        private readonly ModelContext _context;
        public MedicinesRepository(ModelContext context) : base(context)
        {
            _context = context;
        }

        public bool Exists(Medicine t)
        {
            throw new NotImplementedException();
        }
    }
}
