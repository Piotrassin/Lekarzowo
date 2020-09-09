using Lekarzowo.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.Repositories
{
    public class PeopleRepository : IDisposable, IPeopleRepository
    {
        private bool disposed = false;
        private readonly ModelContext _context;

        public PeopleRepository(ModelContext context)
        {
            this._context = context;
        }

        public IEnumerable<Person> GetAll()
        {
            return _context.Person.ToList();
        }

        public Person GetByID(decimal personID)
        {
            return _context.Person.Find(personID);
        }
        public Person GetByEmail(string email)
        {
            return _context.Person.FirstOrDefault(p => p.Email == email);
        }

        public void Insert(Person person)
        {
            _context.Person.Add(person);
        }

        public void Delete(int personID)
        {
            var person = _context.Person.Find(personID);
            _context.Person.Remove(person);
        }

        public void Update(Person person)
        {
            _context.Entry(person).State = EntityState.Modified;
        }
        public void Save()
        {
            _context.SaveChanges();
        }
        public bool PersonExists(decimal id)
        {
            return _context.Person.Any(e => e.Id == id);
        }

        #region Disposing
        public void Dispose()
        {
            _context.Dispose();
        }

        //raczej zbędne
        public void Dispose(bool disposing)
        {
            if (!this.disposed)
            {
                if (disposing)
                {
                    _context.Dispose();
                }
            }
            this.disposed = true;
        }

        //public void Dispose()
        //{
        //    Dispose(true);
        //    GC.SuppressFinalize(this);
        //}

        #endregion

    }
}
