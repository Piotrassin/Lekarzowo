using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Lekarzowo.Models;
using Microsoft.AspNetCore.Authorization;
using Lekarzowo.Repositories;

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
        public PeopleController(IPeopleRepository repository)
        {
            _repository = repository;
        }


        // GET: api/People
        [HttpGet]
        public ActionResult<IEnumerable<Person>> GetPerson()
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
            //TODO: przenieść jako metoda do AuthenticationController
            person.Password = BCrypt.Net.BCrypt.HashPassword(person.Password, 10);

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


        //// DELETE: api/People/5
        //[HttpDelete("{id}")]
        //public async Task<ActionResult<Person>> DeletePerson(decimal id)
        //{
        //    var person = await _context.Person.FindAsync(id);
        //    if (person == null)
        //    {
        //        return NotFound();
        //    }

        //    _context.Person.Remove(person);
        //    await _context.SaveChangesAsync();

        //    return person;
        //}

    }
}
