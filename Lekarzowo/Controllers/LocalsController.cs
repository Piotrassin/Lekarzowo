using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Lekarzowo.Models;
using Lekarzowo.DataAccessLayer.Repositories;
using Lekarzowo.DataAccessLayer.Models;
using Microsoft.AspNetCore.Authorization;

namespace Lekarzowo.Controllers
{
    [Authorize(Roles = "patient,doctor,admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class LocalsController : ControllerBase
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

        // GET: api/Locals/DoctorsWorkplaces?doctorId=1&limit=20&skip=0
        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<Local>>> DoctorsWorkplaces(decimal doctorId, int? limit, int? skip)
        {
            return Ok(await _repository.DoctorsWorkplaces(doctorId, limit, skip));
        }

        // GET: api/Locals/5
        [HttpGet("{id}")]
        public ActionResult<Local> GetLocal(decimal id)
        {
            var local = _repository.GetByID(id);

            if (local == null)
            {
                return NotFound();
            }

            return local;
        }


        [Authorize(Roles = "admin")]
        // PUT: api/Locals/5
        [HttpPut("{id}")]
        public IActionResult PutLocal(decimal id, Local local)
        {
            if (id != local.Id)
            {
                return BadRequest();
            }

            try
            {
                if (!_repository.Exists(local.Id)) return NotFound();

                _repository.Update(local);
                _repository.Save(); 
                return NoContent();
            }
            catch (DbUpdateConcurrencyException e)
            {
                return StatusCode(500, e.Message);
            }
        }

        // POST: api/Locals
        [Authorize(Roles = "admin")]
        [HttpPost]
        public IActionResult PostLocal(Local local)
        {
            
            //if (LocalExists(local.Id))
            //{
            //    return Conflict("That local already exists");
            //}

            try
            {
                _repository.Insert(local);
                _repository.Save();
            }
            catch (DbUpdateException e)
            {
                return StatusCode(500, e.Message);
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
                return NotFound();
            }

            _repository.Delete(city);
            _repository.Save();

            return city;
        }

        private bool LocalExists(decimal id)
        {
            return _repository.Exists(id);
        }
    }
}