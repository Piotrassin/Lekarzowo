using Lekarzowo.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class JWTController : ControllerBase
    {
        private readonly ModelContext _context;

        public JWTController(ModelContext context)
        {
            _context = context;
        }


        /// <summary>
        /// Registration of a new person in the system.
        /// </summary>
        /// <param name="person"></param>
        /// <returns></returns>
        // POST: api/People
        [AllowAnonymous]
        [HttpPost]
        public ActionResult<Person> RegisterNewUser(Person person)
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

        [AllowAnonymous]
        [HttpPost("Login")]
        public async Task<ActionResult<Person>> LoginUser(Person person)
        {
            try
            {
                Person storedPerson = await _context.Person.SingleOrDefaultAsync(p => p.Email == person.Email);
                if (storedPerson == null || !BCrypt.Net.BCrypt.Verify(person.Password, storedPerson.Password))
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