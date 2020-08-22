using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Lekarzowo.Models;

namespace Lekarzowo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PeopleController : ControllerBase
    {
        private readonly ModelContext _context;

        public PeopleController(ModelContext context)
        {
            _context = context;
        }

        // GET: api/People
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Person>>> GetPerson()
        {
            return await _context.Person.ToListAsync();
        }

        // GET: api/People/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Person>> GetPerson(decimal id)
        {
            var person = await _context.Person.FindAsync(id);

            if (person == null)
            {
                return NotFound();
            }

            return person;
        }

        // PUT: api/People/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPerson(decimal id, Person person)
        {
            if (id != person.Id)
            {
                return BadRequest();
            }

            _context.Entry(person).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PersonExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }
        /// <summary>
        /// Registration of a new person in the system.
        /// </summary>
        /// <param name="person"></param>
        /// <returns></returns>
        // POST: api/People
        [HttpPost]
        public  ActionResult<Person> PostPerson(Person person)
        {
            person.Password = BCrypt.Net.BCrypt.HashPassword(person.Password, 10);
            Person user = PersonExists(person.Email);

            if (user != null)
            {
                return StatusCode(409, "User with that email address already exists");
            }
            _context.Person.Add(person);
            _context.SaveChangesAsync();
            //return CreatedAtAction("GetPerson", new { id = person.Id }, person);
            return StatusCode(201);
        }

        [HttpPost("Login")]
        public async Task<ActionResult<Person>> LoginPerson(Person person)
        {
            try
            {
                Person storedPerson = await _context.Person.SingleOrDefaultAsync(p => p.Email == person.Email);
                if (storedPerson == null || BCrypt.Net.BCrypt.Verify(person.Password, storedPerson.Password))
                {
                    return NotFound();
                }
                return storedPerson;
             
            }
            catch (Exception e)
            {
                //throw;
                return StatusCode(409, e); ;
            }
        }


        // DELETE: api/People/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Person>> DeletePerson(decimal id)
        {
            var person = await _context.Person.FindAsync(id);
            if (person == null)
            {
                return NotFound();
            }

            _context.Person.Remove(person);
            await _context.SaveChangesAsync();

            return person;
        }

        private bool PersonExists(decimal id)
        {
            return _context.Person.Any(e => e.Id == id);
        }

        private Person PersonExists(string email)
        {
            return _context.Person.SingleOrDefault(e => e.Email == email);
        }

        private Person PersonExists(string email, string password)
        {
            return _context.Person.SingleOrDefault(e => e.Email == email && e.Password == password);
        }
    }
}
