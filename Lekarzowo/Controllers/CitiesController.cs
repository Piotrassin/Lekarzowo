﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Lekarzowo.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using Lekarzowo.DataAccessLayer.Models;

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
        [HttpGet]
        public  ActionResult<IEnumerable<City>> GetCities()
        {
            return Ok(_repository.GetAll().ToList());
        }

        // GET: api/Cities/AllByName?Name=abc&limit=0&skip=0
        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<City>>> AllByName(string name, int? limit, int? skip)
        {
            return Ok(await _repository.GetAllByName1(name, limit, skip));
        }

        // GET: api/Cities/5
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
        [HttpPut("{id}")]
        public IActionResult PutCity(decimal id, City city)
        {
            if (id != city.Id)
            {
                return BadRequest();
            }

            if (_repository.GetByID(city.Id) != null)
            {
                _repository.Update(city);
            }

            try
            {
                _repository.Save();
            }
            catch (DbUpdateConcurrencyException e)
            {
                if (!CityExists(city.Id))
                {
                    return NotFound();
                }
                else
                {
                    //throw;
                    return StatusCode(503, e.Message);
                }
            }

            return NoContent();
        }

        // POST: api/Cities
        [HttpPost]
        public IActionResult PostCity(City city)
        {
            if(_repository.Exists(city))
            {
                return Conflict("City with that name already exists");
            }
            _repository.Insert(city);
            _repository.Save();

            return Created("", city);
        }

        // DELETE: api/Cities/5
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

        private bool CityExists(decimal id)
        {
            return _repository.Exists(id);
        }
    }
}
