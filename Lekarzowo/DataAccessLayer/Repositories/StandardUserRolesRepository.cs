using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories
{
    public class StandardUserRolesRepository : IStandardUserRolesRepository
    {
        private readonly ModelContext _context;
        public StandardUserRolesRepository(ModelContext context)
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
            return _context.Userroles.OrderBy(x => x.RoleId).ToList();
        }

        public IEnumerable<Userroles> GetAll(decimal PersonId)
        {
            return _context.Userroles.Include(x => x.Role).Where(x => x.PersonId == PersonId).OrderBy(x => x.RoleId).ToList();
        }

        public Userroles GetByID(decimal PersonId, decimal RoleId)
        {
            return _context.Userroles.Include(x => x.Role).FirstOrDefault(x => x.PersonId == PersonId && x.RoleId == RoleId);
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
