using Lekarzowo.DataAccessLayer.DTO;
using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories;
using Lekarzowo.Services;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.Repositories
{
    public class PeopleRepository : BaseNameRepository<Person>, IDisposable, IPeopleRepository
    {
        private bool disposed = false;
        
        public PeopleRepository(ModelContext context) : base(context) { }


        public Person GetByEmail(string email)
        {
            return _context.Person.FirstOrDefault(p => p.Email.ToLower() == email.ToLower());
        }

        public async Task<IEnumerable<object>> GetAllWithRoles(int? limit, int? skip)
        {
            var query = _context.Person
                .Select(x => new
                {
                    id = x.Id,
                    name = x.Name,
                    lastname = x.Lastname,
                    email = x.Email,
                    gender = x.Gender,
                    birthdate = x.Birthdate,
                    pesel = x.Pesel,
                    userroles = _context.Userroles
                        .Where(u => u.PersonId == x.Id)
                        .Select(u => new
                        {
                            roleId = u.RoleId,
                            dateofissue =u.Dateofissue,
                            personId = u.PersonId,
                            roleName = u.Role.Name
                        })
                })
                .OrderBy(x => x.lastname)
                .ThenBy(x => x.name);

            var trimmed = PaginationService<object>.SplitAndLimitQueryable(skip, limit, query);

            return await trimmed.ToListAsync();
        }

        public Person GetSingleByEmailWithRoles(string email)
        {
            return _context.Person.Include(x => x.Userroles).ThenInclude(x => x.Role)
                .FirstOrDefault(p => p.Email.ToLower() == email.ToLower());
        }

        public void Insert(PersonRegistrationDTO a)
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
            //celowo puste. Przesłania metodę z bazy, aby z niej nie korzystać.
            throw new NotSupportedException();
        }

        public bool Exists(string email)
        {
            return _context.Person.Any(x => x.Email.ToLower() == email.ToLower());
        }

        public async Task<IEnumerable<object>> GetAllByNameOrLastname(string name, int? limit, int? skip)
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
