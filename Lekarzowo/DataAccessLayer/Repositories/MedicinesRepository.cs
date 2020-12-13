using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories
{
    public class MedicinesRepository : BaseNameRepository<Medicine>, IMedicinesRepository
    {
        public MedicinesRepository(ModelContext context) : base(context) {}

        public bool Exists(Medicine t)
        {
            throw new NotImplementedException();
        }
    }
}
