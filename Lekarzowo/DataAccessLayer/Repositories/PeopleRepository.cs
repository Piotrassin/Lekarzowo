using Lekarzowo.DataAccessLayer.DTO;
using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories;
using Lekarzowo.Models;
using Lekarzowo.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.Repositories
{
    public class PeopleRepository : BaseNamedRepository<Person>, IDisposable, IPeopleRepository
    {
        private bool disposed = false;
        
        public PeopleRepository(ModelContext context) : base(context) { }


        public Person GetByEmail(string email)
        {
            return _context.Person.FirstOrDefault(p => p.Email.ToLower() == email.ToLower());
        }

        public void Insert(UserRegistrationDTO a)
        {
            _context.Person.Add(new Person
            {
                Name = a.Name,
                Lastname= a.Lastname,
                Birthdate = a.Birthdate,
                Gender = a.Gender,
                Email = a.Email,
                Password = a.Password.Value,
                Pesel = a.Pesel
            });
        }

        new public void Insert(Person a)
        {
            //celowo puste. Przysłania metodę z bazy, aby z niej nie korzystać.
            throw new NotSupportedException();
        }

        public bool Exists(string email)
        {
            return _context.Person.Any(x => x.Email.ToLower() == email.ToLower());
        }

        public async Task<IEnumerable<object>> GetAllByNameOrLastname(string name, int? skip, int? limit)
        {
            var query = _context.Person
                .Where(x => name == null || (x.Name.ToLower().Contains(name.ToLower()) || x.Lastname.ToLower().Contains(name.ToLower())))
                .OrderBy(x => x.Name);
            var orderedQuery = PaginationService<Person>.SplitAndLimitQueryable(skip, limit, query);
            return await orderedQuery.ToListAsync();
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
