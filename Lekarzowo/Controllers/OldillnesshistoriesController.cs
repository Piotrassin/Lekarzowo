using System;
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
    public class OldillnesshistoriesController : ControllerBase
    {
        private readonly IOldIllnessesHistoryRepository _repository;

        public OldillnesshistoriesController(IOldIllnessesHistoryRepository repository)
        {
            _repository = repository;
        }

        // GET: api/Oldillnesshistories
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Oldillnesshistory>>> GetOldillnesshistory()
        {
            return Ok(await _repository.GetAll());
        }


        /// <summary>
        /// TODO: Parametry powinny być przekazywane wewnątrz ciała, a nie w URI?
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        // GET: api/Oldillnesshistories/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Oldillnesshistory>> GetOldillnesshistory(decimal IlnessId, decimal PatientId)
        {
            var oldillnesshistory = await _repository.GetByID(IlnessId, PatientId);

            if (oldillnesshistory == null)
            {
                return NotFound();
            }

            return oldillnesshistory;
        }

        // PUT: api/Oldillnesshistories/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOldillnesshistory(decimal IllnessId, Oldillnesshistory oldillnesshistory)
        {
            if (IllnessId != oldillnesshistory.IllnessId)
            {
                return BadRequest();
            }

            if (_repository.GetByID(oldillnesshistory.IllnessId, oldillnesshistory.PatientId) != null)
            {
                _repository.Update(oldillnesshistory);
            }

            try
            {
                await _repository.Save();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (! await OldillnesshistoryExists(oldillnesshistory.IllnessId, oldillnesshistory.PatientId))
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

        // POST: api/Oldillnesshistories
        [HttpPost]
        public async Task<ActionResult<Oldillnesshistory>> PostOldillnesshistory(Oldillnesshistory oldillnesshistory)
        {
            await _repository.Insert(oldillnesshistory);
            try
            {
                await _repository.Save();
            }
            catch (DbUpdateException)
            {
                if (!await OldillnesshistoryExists(oldillnesshistory.IllnessId, oldillnesshistory.PatientId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetOldillnesshistory", new { id = oldillnesshistory.IllnessId }, oldillnesshistory);
        }

        // DELETE: api/Oldillnesshistories/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Oldillnesshistory>> DeleteOldillnesshistory(decimal IlnessId, decimal PatientId)
        {
            var oldillnesshistory = await _repository.GetByID(IlnessId, PatientId);
            if (oldillnesshistory == null)
            {
                return NotFound();
            }

            _repository.Delete(oldillnesshistory);
            await _repository.Save();

            return oldillnesshistory;
        }

        private Task<bool> OldillnesshistoryExists(decimal IlnessId, decimal PatientId)
        {
            return _repository.Exists(IlnessId, PatientId);
        }
    }
}
