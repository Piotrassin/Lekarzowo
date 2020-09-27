using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Lekarzowo.Models;
using Lekarzowo.DataAccessLayer.Repositories;

namespace Lekarzowo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LocalsController : ControllerBase
    {
        private readonly ILocalsRepository _repository;

        public LocalsController(ILocalsRepository repository)
        {
            _repository = repository;
        }

        // GET: api/Cities
        [HttpGet]
        public ActionResult<IEnumerable<Local>> GetLocals()
        {
            return _repository.GetAll().ToList();
        }

        // GET: api/Cities/5
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

        // PUT: api/Cities/5
        [HttpPut("{id}")]
        public IActionResult PutLocal(decimal id, Local local)
        {
            if (id != local.Id)
            {
                return BadRequest();
            }

            if (_repository.GetByID(local.Id) != null)
            {
                _repository.Update(local);
            }

            try
            {
                _repository.Save();
            }
            catch (DbUpdateConcurrencyException e)
            {
                if (!LocalExists(local.Id))
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
        public IActionResult PostLocal(Local local)
        {
            
            if (_repository.Exists(local.Name))
            {
                return Conflict("That local already exists");
            }
            _repository.Insert(local);
            _repository.Save();

            return Created("", local);
        }

        // DELETE: api/Cities/5
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