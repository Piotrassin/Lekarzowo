using Lekarzowo.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories
{
    public class LocalsRepository : GenericRepository<Local>, ILocalsRepository
    {
        /// <summary>
        /// Przetestować czy dziedziczenie po GenericRepository działa poprawnie i czy jest on inicjowany.
        /// </summary>
        private readonly ModelContext _context;
        public LocalsRepository(ModelContext context) : base(context)
        {
            this._context = context;
        }

        //public void Delete(Local t)
        //{
        //    _context.Local.Remove(t);
        //}

        //public bool Exists(decimal Id)
        //{
        //    return _context.Person.Any(e => e.Id == Id);
        //}

        //public bool Exists(string name)
        //{
        //    throw new NotImplementedException();
        //}

        public bool Exists(Local local)
        {
            throw new NotImplementedException();
        }

        //public IEnumerable<Local> GetAll()
        //{
        //    return _context.Local.ToList();
        //}

        //public Local GetByID(decimal id)
        //{
        //    return _context.Local.Find(id);
        //}

        //public void Insert(Local t)
        //{
        //    _context.Local.Add(t);
        //}

        //public void Save()
        //{
        //    _context.SaveChanges();
        //}

        //public void Update(Local t)
        //{
        //    _context.Entry(t).State = EntityState.Modified;
        //}
    }
}
