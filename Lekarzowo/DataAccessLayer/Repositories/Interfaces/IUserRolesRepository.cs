using Lekarzowo.DataAccessLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories.Interfaces
{
    public interface IUserRolesRepository
    {
        IEnumerable<Userroles> GetAll();
        IEnumerable<Userroles> GetAll(decimal PersonId);
        Userroles GetByID(decimal PersonId, decimal RoleId);
        void Insert(Userroles role);
        void Delete(Userroles role);
        void Update(Userroles role);
        bool Exists(decimal PersonId, decimal RoleId);
        void Save();
    }
}
