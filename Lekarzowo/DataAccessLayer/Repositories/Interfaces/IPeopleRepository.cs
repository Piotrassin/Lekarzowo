using Lekarzowo.DataAccessLayer.DTO;
using Lekarzowo.DataAccessLayer.Repositories;
using Lekarzowo.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.Repositories
{
    public interface IPeopleRepository : IBaseRepository<Person>
    {
        Person GetByEmail(string email);
        void Insert(UserRegistrationDTO personDTO);
        //void CascadeDelete(decimal personId);
        void Dispose(bool disposing);
        void Dispose();
        bool Exists(string email);
    }
}
