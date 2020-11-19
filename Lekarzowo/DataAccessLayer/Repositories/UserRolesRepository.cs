using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories
{
    public class UserRolesRepository : IUserRolesRepository
    {
        private readonly ModelContext _context;
        public UserRolesRepository(ModelContext context)
        {
            _context = context;
        }

        public void Delete(Userroles role)
        {
            _context.Userroles.Remove(role);
        }

        public bool Exists(decimal PersonId, decimal RoleId)
        {
            return _context.Userroles.Any(x => x.PersonId == PersonId && x.RoleId == RoleId);
        }

        public IEnumerable<Userroles> GetAll()
        {
            return _context.Userroles.ToList();
        }

        public IEnumerable<Userroles> GetAll(decimal PersonId)
        {
            return _context.Userroles.Where(x => x.PersonId == PersonId).ToList();
        }

        public Userroles GetByID(decimal PersonId, decimal RoleId)
        {
            return _context.Userroles.FirstOrDefault(x => x.PersonId == PersonId && x.RoleId == RoleId);
        }

        public void Insert(Userroles role)
        {
            _context.Userroles.Add(role);
        }

        public void Save()
        {
            _context.SaveChanges();
        }

        public void Update(Userroles role)
        {
            _context.Userroles.Attach(role);
            _context.Entry(role).State = EntityState.Modified;
        }
    }
}
