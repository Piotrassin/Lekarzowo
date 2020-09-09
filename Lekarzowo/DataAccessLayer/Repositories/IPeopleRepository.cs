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
        Person GetByID(int personID);
        void Insert(Person person);
        void Delete(int personID);
        void Update(Person person);
        void Dispose(bool disposing);
        void Dispose();
    }
}
