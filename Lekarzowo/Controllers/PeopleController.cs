using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Lekarzowo.Models;
using Microsoft.AspNetCore.Authorization;
using Lekarzowo.Repositories;
using Lekarzowo.Services;
using System;
using Lekarzowo.DataAccessLayer.DTO;

namespace Lekarzowo.Controllers
{
    //[Authorize] //wystarczy to odkomentować żeby na wszystkie końcówki z tego kontrolera, była potrzebna autoryzacja, chyba że końcówka jest oznaczona jako [AllowAnonymous].
    [Route("api/[controller]")]
    [ApiController]
    public class PeopleController : ControllerBase
    {
        private readonly IPeopleRepository _repository;
        private readonly IJWTService _jwtService;
        public PeopleController(IPeopleRepository repository, IJWTService jwtService)
        {
            _jwtService = jwtService;
            _repository = repository;
        }


        // GET: api/People
        [HttpGet]
        public ActionResult<IEnumerable<Person>> GetPeople()
        {
            return _repository.GetAll().ToList();
        }

        // GET: api/People/5
        [HttpGet("{id}")]
        public ActionResult<Person> GetPerson(decimal id)
        {
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
                newPerson.Password = AuthService.CreateHash(newPerson.Password);

                //TODO: Może zmienić na metodę Exists(email)?
                Person user = _repository.GetByEmail(newPerson.Email);

                if (user != null)
                {
                    return Conflict("User with that email address already exists");
                    //return StatusCode(409, "User with that email address already exists");
                }

                _repository.Insert(newPerson);
                _repository.Save();

                //return CreatedAtAction("GetPerson", new { id = person.Id }, person);
                return Created("", null);
            }
            return BadRequest();
            
        }

        //POST: api/People/Login
        [AllowAnonymous]
        [HttpPost("Login")]
        public ActionResult<Person> LoginUser(UserLoginDTO current)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    Person stored = _repository.GetByEmail(current.Email);
                    if (stored == null || !AuthService.VerifyPassword(current.Password, stored.Password))
                    {
                        return NotFound();
                    }
                    var token = _jwtService.GenerateAccessToken(stored);

                    return Accepted(new
                    {
                        Id = stored.Id,
                        FirstName = stored.Name,
                        LastName = stored.Lastname,
                        Email = stored.Email,
                        Token = token
                    });
                }
                catch (Exception e)
                {
                    //throw;
                    return Conflict(e.Message); ;
                }
            }
            return Unauthorized();
        }

        // PUT: api/People/5
        [HttpPut("{id}")]
        public ActionResult PutPerson(decimal id, Person edited)
        {
            if (ModelState.IsValid)
            {
                if (id == edited.Id && _repository.Exists(edited.Id))
                {
                    var userToEdit = _repository.GetByID(edited.Id);
                    userToEdit.Name = edited.Name;
                    userToEdit.Lastname = edited.Lastname;
                    userToEdit.Pesel = edited.Pesel;
                    userToEdit.Email = edited.Email;
                    userToEdit.Birthdate = edited.Birthdate;
                    userToEdit.Gender = edited.Gender;

                    _repository.Update(userToEdit);
                    try
                    {
                        _repository.Save();
                    }
                    catch (DbUpdateConcurrencyException e)
                    {
                        return StatusCode(503, e.Message);
                    }
                    return Ok();
                }
            }
            return BadRequest();
        }

        // DELETE: api/People/5
        [HttpDelete("{id}")]
        public  ActionResult<Person> DeletePerson(decimal id)
        {
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
