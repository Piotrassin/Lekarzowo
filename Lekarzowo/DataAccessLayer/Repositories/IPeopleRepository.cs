using Lekarzowo.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.Repositories
{
    public interface IPeopleRepository
    {
        IEnumerable<Person> GetAll();
        Person GetByID(decimal Id);
        Person GetByEmail(string email);
        void Insert(Person person);
        void Delete(Person person);
        void Update(Person person);
        void Save();
        bool PersonExists(decimal id);
        void Dispose(bool disposing);
        void Dispose();
    }
}
