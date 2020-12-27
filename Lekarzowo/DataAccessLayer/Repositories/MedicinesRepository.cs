using Lekarzowo.DataAccessLayer.Models;
using System;

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
