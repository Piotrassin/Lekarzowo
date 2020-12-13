using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories
{
    public class RolesRepository : BaseNameRepository<Role>, IRolesRepository
    {
        public RolesRepository(ModelContext context) : base(context)
        {

        }
    }
}
