using System;
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

        // GET: api/People/Single?personId=1 (opcjonalny. Bez niczego pobierze id z tokenu)
        [HttpGet("[action]")]
        public ActionResult<Person> Single(decimal? personId)
        {
            if (personId == null || IsPatient())
            {
                personId = GetUserIdFromToken();
            }

            var person =  _repository.GetByID(personId.Value);

            if (person == null)
            {
                return NotFound(NotFoundEmptyJsonResult);
            }
            return person;
        }

        //POST: api/People
        [Authorize(Roles = "admin")]
        [HttpPost]
        public ActionResult RegisterUser(PersonRegistrationDTO newPerson)
        {
            newPerson.Password.Value = AuthenticationService.CreateHash(newPerson.Password.Value);

            if (_repository.Exists(newPerson.Email))
            {
                return Conflict(ConflictJsonResult("User with that email address already exists"));
            }

            newPerson.Email = newPerson.Email.ToLower();

            _repository.Insert(newPerson);
            _repository.Save();
            
            return Created("", CreatedEmptyJsonResult);
        }

        //POST: api/People/Login
        [AllowAnonymous]
        [HttpPost("Login")]
        public async Task<ActionResult<Person>> LoginUser(PersonLoginDTO current)
        {
            var storedPerson = _repository.GetByEmail(current.Email);
            if (storedPerson == null)
            {
                return Unauthorized(UnauthorizedEmptyJsonResult);
            }
            try
            {
                //TODO do usunięcia, po tym jak frontend przejdzie na role w tokenie
                var storedUserRoles = await _customUserRolesService.GatherAllUserRoles(storedPerson.Id);
                if (storedUserRoles.Count < 1)
                {
                    return UnprocessableEntity(new JsonResult("User has no roles."));
                }

                var token = await _jwtService.GenerateAccessToken(storedPerson, storedUserRoles.First());

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
                return Conflict(ConflictJsonResult(e.Message));
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
                var newToken = await _jwtService.GenerateAccessToken(storedPerson, roleToActivateName);
                return Ok(new { Token = newToken });
            }
            return BadRequest(BadRequestEmptyJsonResult);
        }

        //POST: /api/people/changeactiverole?roleToActivateName=1
        [HttpPost("[action]")]
        public ActionResult<Person> ChangePassword(PersonChangePasswordDTO current, decimal? userId)
        {
            var id = GetIdFromProperSource(userId);
            if (id <= 1)
            {
                return BadRequest(BadRequestEmptyJsonResult);
            }

            var userById = _repository.GetByID(id);
            var userByEmail = _repository.GetByEmail(current.Email);

            if (userById == userByEmail)
            {
                userByEmail.Password = AuthenticationService.CreateHash(current.NewPassword.Value);
                try
                {
                    _repository.Save();
                    return Ok(new JsonResult("Hasło zmienione"));
                }
                catch (DbUpdateConcurrencyException e)
                {
                    return StatusCode(503, new JsonResult(e.Message));
                }
            }
            return BadRequest(BadRequestEmptyJsonResult);
        }

        // PUT: api/People
        [HttpPut]
        public ActionResult Edit(Person edited, decimal? userId)
        {
            var id = GetIdFromProperSource(userId);
            if (id <= 1)
            {
                return BadRequest(BadRequestEmptyJsonResult);
            }

            if (!_repository.Exists(id))
            {
                return NotFound(NotFoundEmptyJsonResult);
            }

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
                return StatusCode(500, InternalServerErrorJsonResult(e.Message));
            }

            return Ok(OkEmptyJsonResult);
        }

        //TODO: usuwanie osoby powinno kaskadowo usuwać wszystko z nią związane
        // DELETE: api/People
        [HttpDelete]
        public  ActionResult<Person> Delete(decimal? userId)
        {
            var id = GetIdFromProperSource(userId);
            if (id <= 1)
            {
                return BadRequest(BadRequestEmptyJsonResult);
            }

            var person = _repository.GetByID(id);
            if (person == null)
            {
                return NotFound(NotFoundEmptyJsonResult);
            }

            try
            {
                _repository.Delete(person);
                _repository.Save();
            }
            catch (DbUpdateException e)
            {
                return StatusCode(500, InternalServerErrorJsonResult(e.Message));
            }

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
