using Lekarzowo.DataAccessLayer.DTO;
using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.Repositories;
using Lekarzowo.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PeopleController : BaseController
    {
        private readonly IJWTService _jwtService;
        private readonly ICustomUserRolesService _customUserRolesService;

        private readonly IPeopleRepository _repository;
        public PeopleController(IPeopleRepository repository, IJWTService jwtService, ICustomUserRolesService urolesService)
        {
            _jwtService = jwtService;
            _repository = repository;
            _customUserRolesService = urolesService;
        }

        // GET: api/People/AllByPatientId
        [Authorize(Roles = "admin")]
        [HttpGet("[action]")]
        public ActionResult<IEnumerable<Person>> All()
        {
            return Ok(_repository.GetAll());
        }

        // GET: api/People/AllByName?Name=abc&limit=0&skip=0
        [Authorize(Roles = "admin")]
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
        [Authorize(Roles = "admin")]
        [HttpPost]
        public ActionResult RegisterUser(PersonRegistrationDTO newPerson)
        {
            newPerson.Password.Value = AuthService.CreateHash(newPerson.Password.Value);

            if (_repository.Exists(newPerson.Email))
            {
                return Conflict(new JsonResult("User with that email address already exists"));
            }

            newPerson.Email = newPerson.Email.ToLower();

            _repository.Insert(newPerson);
            _repository.Save();
            
            return Created("", null);
        }

        #region role2(rozwiazanie hybrydowe)
        //POST: api/People/Login
        [AllowAnonymous]
        [HttpPost("Login")]
        public async Task<ActionResult<Person>> LoginUser(PersonLoginDTO current)
        {
            var storedPerson = _repository.GetByEmail(current.Email);
            if (storedPerson == null)
            {
                return Unauthorized();
            }
            try
            {
                var storedUserRoles = await _customUserRolesService.GatherAllUserRoles(storedPerson.Id);
                if (storedUserRoles.Count < 1)
                {
                    return UnprocessableEntity(new JsonResult("User has no roles."));
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
                var storedPerson = _repository.GetByID(personId);
                var newToken = _jwtService.GenerateAccessToken(storedPerson, roleToActivateName);
                return Ok(new { Token = newToken });
            }
            return BadRequest();
        }
        #endregion


        //POST: /api/people/changeactiverole?roleToActivateName=1
        [HttpPost("[action]")]
        public ActionResult<Person> ChangePassword(PersonChangePasswordDTO current, decimal? userId)
        {
            var id = GetIdFromProperSource(userId);
            if (id <= 1)
            {
                return BadRequest();
            }

            var userById = _repository.GetByID(id);
            var userByEmail = _repository.GetByEmail(current.Email);

            if (userById == userByEmail)
            {
                userByEmail.Password = AuthService.CreateHash(current.NewPassword.Value);
                try
                {
                    _repository.Save();
                    return Ok(new JsonResult("Hasło zmienione"));
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
        public ActionResult Edit(Person edited, decimal? userId)
        {
            var id = GetIdFromProperSource(userId);
            if (id <= 1)
            {
                return BadRequest();
            }

            if (_repository.Exists(id))
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
                    return Ok();
                }
                catch (DbUpdateConcurrencyException e)
                {
                    return StatusCode(500, e.Message);
                }
            }

            return BadRequest();
        }

        // DELETE: api/People
        [HttpDelete]
        public  ActionResult<Person> Delete(decimal? userId)
        {
            var id = GetIdFromProperSource(userId);
            if (id <= 1)
            {
                return BadRequest();
            }

            var person = _repository.GetByID(id);
            if (person == null)
            {
                return NotFound();
            }
            _repository.Delete(person);
            _repository.Save();

            return person;
        }

        private decimal GetIdFromProperSource(decimal? userId)
        {
            if (!IsAdmin())
            {
                return GetUserIdFromToken();
            }

            return userId ?? 0;
        }
       

    }
}
