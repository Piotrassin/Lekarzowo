using Lekarzowo.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class, IEntity
    {
        private readonly ModelContext _context;
        private readonly DbSet<T> table = null;

        public GenericRepository(ModelContext context)
        {
            this._context = context;
            table = _context.Set<T>();
        }

        public void Delete(T t)
        {
            table.Remove(t);
        }

        public IEnumerable<T> GetAll()
        {
            return table.ToList();
        }

        public T GetByID(decimal id)
        {
            return table.Find(id);
        }

        public void Insert(T t)
        {
            table.Add(t);
        }

        public void Save()
        {
            _context.SaveChanges();
        }

        public void Update(T t)
        {
            table.Attach(t);
            _context.Entry(t).State = EntityState.Modified;
        }
        public bool Exists(decimal Id)
        {
            return table.Any(x => x.Id == Id);
        }

        public bool Exists(string name)
        {
            return table.Any(x => x.Name == name);
        }
    }
}
