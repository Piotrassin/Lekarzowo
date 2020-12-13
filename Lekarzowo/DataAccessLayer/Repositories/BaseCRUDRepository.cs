using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Lekarzowo.DataAccessLayer.Repositories
{
    public class BaseCRUDRepository<T> : IBaseCRUDRepository<T> where T : class
    {
        protected readonly ModelContext _context;
        protected readonly DbSet<T> _table = null;

        public BaseCRUDRepository(ModelContext context)
        {
            this._context = context;
            _table = _context.Set<T>();
        }

        public void Delete(T t)
        {
            _table.Remove(t);
        }

        public IEnumerable<T> GetAll()
        {
            return _table.ToList();
        }

        public void Insert(T t)
        {
            _table.Add(t);
        }

        public void Save()
        {
            _context.SaveChanges();
        }

        public void Update(T t, T entry)
        {
            _context.Entry(entry).CurrentValues.SetValues(t);
        }
    }
}
