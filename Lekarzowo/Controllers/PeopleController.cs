using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Lekarzowo.Repositories;
using Lekarzowo.Services;
using System;
using System.Data;
using System.Diagnostics;
using Lekarzowo.DataAccessLayer.DTO;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using System.Transactions;
using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories;

namespace Lekarzowo.Controllers
{
    [Authorize] //wystarczy to odkomentować żeby na wszystkie końcówki z tego kontrolera, była potrzebna autoryzacja,
    //chyba że końcówka jest oznaczona jako [AllowAnonymous].
    [Route("api/[controller]")]
    [ApiController]
    public class PeopleController : BaseController
    {
        private readonly IJWTService _jwtService;
        private readonly ICustomUserRolesService _customUserRolesService;

        private readonly IPeopleRepository _repository;
        private readonly IPatientsRepository _patientsRepository;
        public PeopleController(IPeopleRepository repository, IJWTService jwtService, IPatientsRepository patientsRepository, ICustomUserRolesService urolesService)
        {
            _jwtService = jwtService;
            _repository = repository;
            _patientsRepository = patientsRepository;
            _customUserRolesService = urolesService;
        }

        // GET: api/People/All
        [Authorize(Roles = "admin")]
        [HttpGet("[action]")]
        public ActionResult<IEnumerable<Person>> All()
        {
            return Ok(_repository.GetAll());
        }

        // GET: api/People/AllByName?Name=abc&limit=0&skip=0
        //[Authorize(Roles = "admin")]
        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<Person>>> AllByName(string name, int? limit, int? skip)
        {
            return Ok(await _repository.GetAllByNameOrLastname(name, limit, skip));
        }

        // GET: api/People/Single
        [HttpGet("[action]")]
        public ActionResult<Person> Single()
        {
            var id = GetUserIdFromToken();
            var person =  _repository.GetByID(id);

            if (person == null)
            {
                return NotFound();
            }
            return person;
        }

        //POST: api/People
        [AllowAnonymous]
        [HttpPost]
        public ActionResult RegisterUser(UserRegistrationDTO newPerson)
        {
            if (ModelState.IsValid)
            {
                newPerson.Password.Value = AuthService.CreateHash(newPerson.Password.Value);

                if (_repository.Exists(newPerson.Email))
                {
                    return Conflict("User with that email address already exists");
                }

                using(var transaction = new TransactionScope())
                {
                    newPerson.Email = newPerson.Email.ToLower();

                    _repository.Insert(newPerson);
                    _repository.Save();

                    Person user = _repository.GetByEmail(newPerson.Email);
                    Patient newPatient = new Patient() { Id = user.Id, IdNavigation = user };

                    _patientsRepository.Insert(newPatient);
                    _repository.Save();

                    transaction.Complete();
                }
                //return CreatedAtAction("GetPerson", new { personId = personId.Id }, personId);
                return Created("", null);
            }
            return BadRequest();
            
        }


        #region role1(rozwiązanie z redundancją)
        ////POST: api/People/Login
        //[AllowAnonymous]
        //[HttpPost("Login")]
        //public ActionResult<Person> LoginUser(UserLoginDTO current)
        //{
        //    Person storedPerson = _repository.GetByEmail(current.Email);
        //    try
        //    {
        //        var storedUserRoles = _customUserRolesService.GetAll(storedPerson.Id);
        //        var shortRoleData = new List<object>();
        //        if (storedUserRoles != null)
        //        {
        //            foreach (var uRole in storedUserRoles)
        //            {
        //                shortRoleData.Add(new { RoleId = uRole.RoleId, RoleName = uRole.Role.Name });
        //            }
        //        }
        //        else
        //        {
        //            //TODO: Opisać w dokumentacji, że im niższy personId roli, tym niższy przydział
        //            //TODO: Role lekarz i pacjent autoryzować na podstawie rekordów w tabelach Patient i Doctor, a nie roli. Dopiero role admin, etc. na podstawie UserRoles
        //            //TODO: Dodać kontrolę redundancji w CRUDzie doktora i pacjenta
        //            var leastImportantRole = _customUserRolesService.GetAll().First();
        //            _customUserRolesService.Insert(new Userroles()
        //            {
        //                RoleId = leastImportantRole.RoleId,
        //                PersonId = storedPerson.Id,
        //                Dateofissue = DateTime.Now
        //            }); 
        //            shortRoleData.Add(new
        //            {
        //                RoleId = leastImportantRole.RoleId,
        //                RoleName = leastImportantRole.Role.Name
        //            });
        //        }
        //        //if (stored == null || !AuthService.VerifyPassword(current.Password.Value, stored.Password))
        //        //{
        //        //    return NotFound();
        //        //}

        //        var token = _jwtService.GenerateAccessToken(storedPerson, storedUserRoles.First().Role);

        //        return Accepted(new
        //        {
        //            Id = storedPerson.Id,
        //            FirstName = storedPerson.Name,
        //            LastName = storedPerson.Lastname,
        //            Email = storedPerson.Email,
        //            Roles = shortRoleData,
        //            Token = token
        //        });
        //    }
        //    catch (DBConcurrencyException e)
        //    {
        //        //throw;
        //        return Conflict(e.Message);
        //    }
        //}

        ////POST: api/People/ChangeActiveRole
        //[HttpPost("[action]")]
        //public ActionResult<Person> ChangeActiveRole(decimal roleToActivateId)
        //{
        //    var personId = GetUserIdFromToken();
        //    var newRole = _customUserRolesService.GetByID(personId, roleToActivateId);

        //    if (newRole != null)
        //    {
        //        Person storedPerson = _repository.GetByID(personId);
        //        var newToken = _jwtService.GenerateAccessToken(storedPerson, newRole.Role);
        //        return Ok(new { Token = newToken });
        //    }
        //    return BadRequest();
        //}
        #endregion


        #region role2(rozwiazanie hybrydowe)
        //POST: api/People/Login
        [AllowAnonymous]
        [HttpPost("Login")]
        public async Task<ActionResult<Person>> LoginUser(UserLoginDTO current)
        {
            Person storedPerson = _repository.GetByEmail(current.Email);
            try
            {
                var storedUserRoles = await _customUserRolesService.GatherAllUserRoles(storedPerson.Id);
                if (storedUserRoles.Count < 1)
                {
                    //TODO: Każdy użytkownik musi mieć rolę. Jak nie ma to trzeba ręcznie dodać np. przez API, albo przez bazę.
                    return UnprocessableEntity("User has no roles.");
                }

                var token = _jwtService.GenerateAccessToken(storedPerson, storedUserRoles.First());

                return Accepted(new
                {
                    Id = storedPerson.Id,
                    FirstName = storedPerson.Name,
                    LastName = storedPerson.Lastname,
                    Email = storedPerson.Email,
                    Roles = storedUserRoles,
                    Token = token
                });
            }
            catch (DBConcurrencyException e)
            {
                //throw;
                return Conflict(e.Message);
            }
        }

        //POST: api/People/ChangeActiveRole
        [HttpPost("[action]")]
        public async Task<ActionResult<Person>> ChangeActiveRole(string roleToActivateName)
        {
            var personId = GetUserIdFromToken();
            var uRoles = await _customUserRolesService.GatherAllUserRoles(personId);

            if (uRoles.Count > 0 && uRoles.Contains(roleToActivateName))
            {
                Person storedPerson = _repository.GetByID(personId);
                var newToken = _jwtService.GenerateAccessToken(storedPerson, roleToActivateName);
                return Ok(new { Token = newToken });
            }
            return BadRequest();
        }
        #endregion


        //POST: /api/people/changeactiverole?roleToActivateName=1
        [HttpPost("[action]")]
        public ActionResult<Person> ChangePassword(UserChangePasswordDTO current)
        {
            var id = GetUserIdFromToken();
            var userById = _repository.GetByID(id);
            var userByEmail = _repository.GetByEmail(current.Email);

            if (userById == userByEmail)
            {
                userByEmail.Password = AuthService.CreateHash(current.NewPassword.Value);
                try
                {
                    _repository.Save();
                    return Ok("Hasło zmienione");
                }
                catch (DbUpdateConcurrencyException e)
                {
                    return StatusCode(503, e.Message);
                }
            }
            return BadRequest();
        }

        // PUT: api/People
        [HttpPut]
        public ActionResult Edit(Person edited)
        {
            var id = GetUserIdFromToken();
            if (id == edited.Id && _repository.Exists(id))
            {
                var userToEdit = _repository.GetByID(id);
                userToEdit.Name = edited.Name;
                userToEdit.Lastname = edited.Lastname;
                userToEdit.Pesel = edited.Pesel;
                userToEdit.Email = edited.Email.ToLower();
                userToEdit.Birthdate = edited.Birthdate;
                userToEdit.Gender = edited.Gender;

                try
                {
                    _repository.Update(userToEdit);
                    _repository.Save();
                }
                catch (DbUpdateConcurrencyException e)
                {
                    return StatusCode(503, e.Message);
                }
                return Ok();
            }
            return BadRequest();
        }

        // DELETE: api/People
        [HttpDelete]
        public  ActionResult<Person> Delete()
        {
            var id = GetUserIdFromToken();
            var person = _repository.GetByID(id);
            if (person == null)
            {
                return NotFound();
            }
            _repository.Delete(person);
            _repository.Save();

            return person;
        }

       
    }
}
