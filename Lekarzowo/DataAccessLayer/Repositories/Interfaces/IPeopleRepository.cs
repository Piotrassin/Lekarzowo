using Lekarzowo.DataAccessLayer.DTO;
using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using Lekarzowo.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.Repositories
{
    public interface IPeopleRepository : IBaseNameRepository<Person>
    {
        Person GetByEmail(string email);
        Person GetByEmailWithRoles(string email);
        void Insert(PersonRegistrationDTO personDTO);
        void Dispose(bool disposing);
        void Dispose();
        bool Exists(string email);
        Task<IEnumerable<object>> GetAllByNameOrLastname(string name, int? skip, int? limit);
    }
}
