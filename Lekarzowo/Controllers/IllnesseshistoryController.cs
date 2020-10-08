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
    public class IllnesseshistoryController : ControllerBase
    {
        private readonly IIllnessesHistoryRepository _repository;

        public IllnesseshistoryController(IIllnessesHistoryRepository context)
        {
            _repository = context;
        }

        // GET: api/Illnesseshistory
        [HttpGet]
        public ActionResult<IEnumerable<Illnesshistory>> GetIllnesshistory()
        {
            return _repository.GetAll().ToList();
        }

        // GET: api/Illnesseshistory/5
        [HttpGet("{id}")]
        public ActionResult<Illnesshistory> GetIllnesshistory(decimal id)
        {
            var illnesshistory = _repository.GetByID(id);

            if(illnesshistory == null)
            {
                return NotFound();
            }

            return illnesshistory;
        }

        // PUT: api/Illnesseshistory/5
        [HttpPut("{id}")]
        public IActionResult PutIllnesshistory(decimal id, Illnesshistory illnesshistory)
        {
            if (id != illnesshistory.Id)
            {
                return BadRequest();
            }

            if (_repository.GetByID(illnesshistory.Id) != null)
            {
                _repository.Update(illnesshistory);
            }

            try
            {
                _repository.Save();
            }
            catch (DbUpdateConcurrencyException e)
            {
                if (!IllnesshistoryExists(id))
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

        // POST: api/Illnesseshistory
        [HttpPost]
        public ActionResult<Illnesshistory> PostIllnesshistory(Illnesshistory illnesshistory)
        {
            if (_repository.Exists(illnesshistory))
            {
                return Conflict("That illness history already exists");
            }
            _repository.Insert(illnesshistory);
            _repository.Save();

            return Created("", illnesshistory);
        }

        // DELETE: api/Illnesseshistory/5
        [HttpDelete("{id}")]
        public ActionResult<Illnesshistory> DeleteIllnesshistory(decimal id)
        {
            var illnesshistory = _repository.GetByID(id);
            if (illnesshistory == null)
            {
                return NotFound();
            }

            _repository.Delete(illnesshistory);
            _repository.Save();

            return illnesshistory;
        }

        private bool IllnesshistoryExists(decimal id)
        {
            return _repository.Exists(id);
        }
    }
}
