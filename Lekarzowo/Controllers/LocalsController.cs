﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Lekarzowo.Controllers
{
    [Authorize(Roles = "patient,doctor,admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class LocalsController : BaseController
    {
        private readonly ILocalsRepository _repository;

        public LocalsController(ILocalsRepository repository)
        {
            _repository = repository;
        }

        // GET: api/Locals
        [HttpGet]
        public ActionResult<IEnumerable<Local>> GetLocals()
        {
            return _repository.GetAll().ToList();
        }

        // GET: api/Locals/AllByName?Name=abc&limit=10&skip=0
        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<Local>>> AllByName(string name, int? limit, int? skip)
        {
            return Ok(await _repository.GetAllByName(name, limit, skip));
        }

        // GET: api/Locals/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Local>> GetLocal(decimal id)
        {
            var local = await _repository.GetByIdWithCity(id);

            if (local == null)
            {
                return NotFound(NotFoundEmptyJsonResult);
            }

            return local;
        }

        // PUT: api/Locals/5
        [Authorize(Roles = "admin")]
        [HttpPut("{id}")]
        public IActionResult PutLocal(decimal id, Local local)
        {
            if (id != local.Id)
            {
                return BadRequest(BadRequestEmptyJsonResult);
            }

            if (!LocalExists(local.Id))
            {
                return NotFound(NotFoundEmptyJsonResult);
            }

            try
            {
                _repository.Update(local);
                _repository.Save(); 
            }
            catch (DbUpdateConcurrencyException e)
            {
                return StatusCode(500, InternalServerErrorJsonResult(e.Message));
            }

            return Ok(OkEmptyJsonResult);
        }

        // POST: api/Locals
        [Authorize(Roles = "admin")]
        [HttpPost]
        public IActionResult PostLocal(Local local)
        {
            if (_repository.Exists(local.Name))
            {
                return Conflict(ConflictJsonResult("Local with that name already exists"));
            }

            local.Id = Decimal.Zero;
            try
            {
                _repository.Insert(local);
                _repository.Save();
            }
            catch (DbUpdateException e)
            {
                return StatusCode(500, InternalServerErrorJsonResult(e.Message));
            }

            return Created("", local);
        }

        // DELETE: api/Locals/5
        [Authorize(Roles = "admin")]
        [HttpDelete("{id}")]
        public ActionResult<Local> DeleteLocal(decimal id)
        {
            var city = _repository.GetByID(id);
            if (city == null)
            {
                return NotFound(NotFoundEmptyJsonResult);
            }

            try
            {
                _repository.Delete(city);
                _repository.Save();
            }
            catch (DbUpdateException e)
            {
                return StatusCode(500, InternalServerErrorJsonResult(e.Message));
            }

            return city;
        }

        private bool LocalExists(decimal id)
        {
            return _repository.Exists(id);
        }
    }
}