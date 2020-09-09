using Lekarzowo.Helpers;
using Lekarzowo.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Lekarzowo.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly ModelContext _context;
        private readonly SecretSettings _settings;

        public AuthenticationController(ModelContext context, IOptions<SecretSettings> secretSettings)
        {
            _settings = secretSettings.Value;
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
        public ActionResult<Person> RegisterUser(Person person)
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
        public async Task<ActionResult<Person>> LoginUser(Person currentPerson)
        {
            try
            {
                Person storedPerson = await _context.Person.SingleOrDefaultAsync(p => p.Email == currentPerson.Email);
                if (storedPerson == null || !BCrypt.Net.BCrypt.Verify(currentPerson.Password, storedPerson.Password))
                {
                    return NotFound();
                }
                var token = GenerateJWT(storedPerson);
                return Accepted(new
                {
                    Id = storedPerson.Id,
                    Username = storedPerson.Name,
                    FirstName = storedPerson.Lastname,
                    LastName = storedPerson.Email,
                    Token = token
                });
            }
            catch (Exception e)
            {
                //throw;
                return Conflict(e.Message); ;
            }
        }


        private string GenerateJWT(Person person)
        {
            //TODO: Sekret do tworzenia podpisu powinien być pobierany z appsettings.json 
            //var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_settings.Secret));

            var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes("super sekretny sekret, którego nikt nie może nigdy poznaćm, bo przypał"));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.UniqueName, person.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, person.Email)
            };

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }


        private Person PersonExists(string email)
        {
            return _context.Person.SingleOrDefault(e => e.Email == email);
        }


        //private Person PersonExists(string email, string password)
        //{
        //    return _context.Person.SingleOrDefault(e => e.Email == email && e.Password == password);
        //}


    }
}