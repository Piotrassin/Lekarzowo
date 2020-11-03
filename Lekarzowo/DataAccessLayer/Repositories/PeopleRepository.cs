using Lekarzowo.DataAccessLayer.DTO;
using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories;
using Lekarzowo.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.Repositories
{
    public class PeopleRepository : BaseRepository<Person>, IDisposable, IPeopleRepository
    {
        private bool disposed = false;
        private readonly ModelContext _context;

        public PeopleRepository(ModelContext context) : base(context)
        {
            this._context = context;
        }
        public Person GetByEmail(string email)
        {
            return _context.Person.FirstOrDefault(p => p.Email == email);
        }

        public void Insert(PersonDTO a)
        {
            _context.Person.Add(new Person
            {
                Name = a.Name,
                Lastname= a.Lastname,
                Birthdate = a.Birthdate,
                Gender = a.Gender,
                Email = a.Email,
                Password = a.Password,
                Pesel = a.Pesel
            });
        }

        new public void Insert(Person a)
        {
            //celowo puste. Przysłania metodę z bazy, aby z niej nie korzystać.
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
