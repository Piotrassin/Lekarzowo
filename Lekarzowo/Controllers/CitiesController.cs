﻿using Lekarzowo.DataAccessLayer.Models;
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
    public class CitiesController : ControllerBase
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
                return NotFound();
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
                return BadRequest();
            }
            if (_repository.Exists(city.Name))
            {
                return Conflict("City with that name already exists");
            }

            try
            {
                if (_repository.Exists(city.Id))
                {
                    _repository.Update(city);
                    _repository.Save();
                    return Ok();
                }
                return NotFound();
            }
            catch (DbUpdateConcurrencyException e)
            {
                return StatusCode(500, e.Message);
            }
        }

        // POST: api/Cities
        [Authorize(Roles = "admin")]
        [HttpPost]
        public IActionResult PostCity(City city)
        {
            if(_repository.Exists(city.Name))
            {
                return Conflict("City with that name already exists");
            }

            try
            {
                _repository.Insert(city);
                _repository.Save();
            }
            catch (DbUpdateException e)
            {
                return StatusCode(500, e.Message);
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
                return NotFound();
            }

            _repository.Delete(city);
            _repository.Save();

            return city;
        }
    }
}
