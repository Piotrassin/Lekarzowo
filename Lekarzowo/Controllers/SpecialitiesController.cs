﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;

namespace Lekarzowo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SpecialitiesController : ControllerBase
    {
        private readonly ISpecialitiesRepository _repository;

        public SpecialitiesController(ISpecialitiesRepository repository)
        {
            _repository = repository;
        }

        // GET: api/Specialities
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Speciality>>> GetSpeciality()
        {
            return Ok(_repository.GetAll());
        }

        // GET: api/Specialities/AllByName?Name=abc&limit=0&skip=0
        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<Speciality>>> AllByName(string name, int? limit, int? skip)
        {
            return Ok(await _repository.GetAllByName1(name, limit, skip));
        }

        // GET: api/Specialities/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Speciality>> GetSpeciality(decimal id)
        {
            var speciality = _repository.GetByID(id);

            if (speciality == null)
            {
                return NotFound();
            }

            return speciality;
        }

        // PUT: api/Specialities/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSpeciality(decimal id, Speciality speciality)
        {
            if (id != speciality.Id)
            {
                return BadRequest();
            }

            if (_repository.GetByID(speciality.Id) != null)
            {
                _repository.Update(speciality);
            }

            try
            {
                _repository.Save();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SpecialityExists(id))
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

        // POST: api/Specialities
        [HttpPost]
        public async Task<ActionResult<Speciality>> PostSpeciality(Speciality speciality)
        {
            if (SpecialityExists(speciality.Id))
            {
                return Conflict("That speciality already exists");
            }
            _repository.Insert(speciality);
            _repository.Save();

            return Created("", speciality);
        }

        // DELETE: api/Specialities/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Speciality>> DeleteSpeciality(decimal id)
        {
            var speciality = _repository.GetByID(id);
            if (speciality == null)
            {
                return NotFound();
            }

            _repository.Delete(speciality);
            _repository.Save();

            return speciality;
        }

        private bool SpecialityExists(decimal id)
        {
            return _repository.Exists(id);
        }
    }
}
