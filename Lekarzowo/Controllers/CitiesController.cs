using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CitiesController : BaseController
    {
        private readonly ICitiesRepository _repository;

        public CitiesController(ICitiesRepository repository)
        {
            _repository = repository;
        }

        // GET: api/Cities
        [Authorize(Roles = "patient,doctor,admin")]
        [HttpGet]
        public  ActionResult<IEnumerable<City>> GetCities()
        {
            return Ok(_repository.GetAll().ToList());
        }

        // GET: api/Cities/AllByName?Name=abc&limit=0&skip=0
        [Authorize(Roles = "patient,doctor,admin")]
        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<City>>> AllByName(string name, int? limit, int? skip)
        {
            return Ok(await _repository.GetAllByName(name, limit, skip));
        }

        // GET: api/Cities/5
        [Authorize(Roles = "patient,doctor,admin")]
        [HttpGet("{id}")]
        public ActionResult<City> GetCity(decimal id)
        {
            var city = _repository.GetByID(id);

            if (city == null)
            {
                return NotFound(new JsonResult(""));
            }
            return city;
        }

        // PUT: api/Cities/5
        [Authorize(Roles = "admin")]
        [HttpPut("{id}")]
        public IActionResult PutCity(decimal id, City city)
        {
            if (id != city.Id)
            {
                return BadRequest(new JsonResult(""));
            }
            if (!_repository.Exists(city.Id))
            {
                return NotFound(new JsonResult(""));
            }
            if (_repository.Exists(city.Name))
            {
                return Conflict(new JsonResult("City with that name already exists"));
            }

            try
            {
                _repository.Update(city);
                _repository.Save();
            }
            catch (DbUpdateConcurrencyException e)
            {
                return StatusCode(500, new JsonResult(e.Message));
            }

            return Ok(new JsonResult(""));
        }

        // POST: api/Cities
        [Authorize(Roles = "admin")]
        [HttpPost]
        public IActionResult PostCity(City city)
        {
            if(_repository.Exists(city.Name))
            {
                return Conflict(new JsonResult("City with that name already exists"));
            }

            try
            {
                _repository.Insert(city);
                _repository.Save();
            }
            catch (DbUpdateException e)
            {
                return StatusCode(500, new JsonResult(e.Message));
            }

            return Created("", city);
        }

        // DELETE: api/Cities/5
        [Authorize(Roles = "admin")]
        [HttpDelete("{id}")]
        public  ActionResult<City> DeleteCity(decimal id)
        {
            var city = _repository.GetByID(id);
            if(city == null)
            {
                return NotFound(new JsonResult(""));
            }

            try
            {
                _repository.Delete(city);
                _repository.Save();
            }
            catch (DbUpdateException e)
            {
                return StatusCode(500, new JsonResult(e.Message));
            }

            return city;
        }
    }
}
