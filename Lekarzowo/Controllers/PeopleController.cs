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

namespace Lekarzowo.Controllers
{
    //[Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PeopleController : ControllerBase
    {
        //private readonly ModelContext _context;

        //public PeopleController(ModelContext context)
        //{
        //    _context = context;
        //}

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
            return Ok(_repository.GetAll());
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

            return Ok(person);
        }


        //POST: api/People
        [AllowAnonymous]
        [HttpPost]
        public ActionResult<Person> RegisterUser(Person person)
        {
            person.Password = AuthService.CreateHash(person.Password);

            //TODO: Może zmienić na metodę Exists(Email email)?
            Person user = _repository.GetByEmail(person.Email);

            if (user != null)
            {
                return StatusCode(409, "User with that email address already exists");
            }

            _repository.Insert(person);
            _repository.Save();

            //return CreatedAtAction("GetPerson", new { id = person.Id }, person);
            return StatusCode(201);
        }

        //POST: api/People/Login
        [AllowAnonymous]
        [HttpPost("Login")]
        public ActionResult<Person> LoginUser(Person current)
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
                    Username = stored.Name,
                    FirstName = stored.Lastname,
                    LastName = stored.Email,
                    Token = token
                });
            }
            catch (Exception e)
            {
                //throw;
                return Conflict(e.Message); ;
            }
        }

        // PUT: api/People/5
        [HttpPut("{id}")]
        public ActionResult PutPerson(decimal id, Person person)
        {
            if (id != person.Id)
            {
                return BadRequest();
            }
            if (_repository.PersonExists(person.Id))
            {
                _repository.Update(person);
            }

            try
            {
                _repository.Save();
            }
            catch (DbUpdateConcurrencyException e)
            {
                return StatusCode(503, e.Message);
            }

            return NoContent();
        }


        // DELETE: api/People/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Person>> DeletePerson(decimal id)
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
