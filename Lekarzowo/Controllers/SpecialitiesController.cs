﻿using System;
using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Lekarzowo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SpecialitiesController : BaseController
    {
        private readonly ISpecialitiesRepository _repository;

        public SpecialitiesController(ISpecialitiesRepository repository)
        {
            _repository = repository;
        }

        // GET: api/Specialities
        [Authorize(Roles = "admin")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Speciality>>> GetSpeciality()
        {
            return Ok(_repository.GetAll());
        }

        // GET: api/Specialities/AllByName?Name=abc&limit=0&skip=0
        [Authorize(Roles = "patient,doctor,admin")]
        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<Speciality>>> AllByName(string name, int? limit, int? skip)
        {
            return Ok(await _repository.GetAllByName(name, limit, skip));
        }

        // GET: api/Specialities/5
        [Authorize(Roles = "admin")]
        [HttpGet("{id}")]
        public async Task<ActionResult<Speciality>> GetSpeciality(decimal id)
        {
            var speciality = _repository.GetByID(id);

            if (speciality == null)
            {
                return NotFound(NotFoundEmptyJsonResult);
            }

            return speciality;
        }

        // PUT: api/Specialities/5
        [Authorize(Roles = "admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSpeciality(decimal id, Speciality speciality)
        {
            if (id != speciality.Id)
            {
                return BadRequest(BadRequestEmptyJsonResult);
            }
            if (!SpecialityExists(id))
            {
                return NotFound(NotFoundEmptyJsonResult);
            }

            try
            {
                _repository.Update(speciality);
                _repository.Save();
            }
            catch (DbUpdateConcurrencyException e)
            {
                return StatusCode(500, InternalServerErrorJsonResult(e.Message));
            }

            return Ok(OkEmptyJsonResult);
        }

        // POST: api/Specialities
        [Authorize(Roles = "admin")]
        [HttpPost]
        public async Task<ActionResult<Speciality>> PostSpeciality(Speciality speciality)
        {
            if (_repository.Exists(speciality.Name))
            {
                return Conflict(ConflictJsonResult("Specialization with that name already exists"));
            }

            speciality.Id = Decimal.Zero;
            try
            {
                _repository.Insert(speciality);
                _repository.Save();
            }
            catch (DbUpdateConcurrencyException e)
            {
                return StatusCode(500, InternalServerErrorJsonResult(e.Message));
            }

            return Created("", speciality);
        }

        // DELETE: api/Specialities/5
        [Authorize(Roles = "admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult<Speciality>> DeleteSpeciality(decimal id)
        {
            var speciality = _repository.GetByID(id);
            if (speciality == null)
            {
                return NotFound(NotFoundEmptyJsonResult);
            }

            try
            {
                _repository.Delete(speciality);
                _repository.Save();
            }
            catch (DbUpdateException e)
            {
                return StatusCode(500, InternalServerErrorJsonResult(e.Message));
            }

            return speciality;
        }

        private bool SpecialityExists(decimal id)
        {
            return _repository.Exists(id);
        }
    }
}
