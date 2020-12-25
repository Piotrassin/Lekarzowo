using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using Oracle.ManagedDataAccess.Client;

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
        [HttpGet("{PatientId}")]
        public async Task<ActionResult<IEnumerable<Oldillnesshistory>>> GetOldillnesshistory()
        {
            return Ok(await _repository.GetAll());
        }

        // GET: api/Oldillnesshistories/5
        [HttpGet("{PatientId}/{IlnessId}")]
        public async Task<ActionResult<Oldillnesshistory>> GetOldillnesshistory(decimal PatientId, decimal IlnessId)
        {
            var oldillnesshistory = await _repository.GetByID(IlnessId, PatientId);

            if (oldillnesshistory == null)
            {
                return NotFound();
            }

            return oldillnesshistory;
        }

        // PUT: api/Oldillnesshistories/5
        [HttpPut("{PatientId}/{IlnessId}")]
        public async Task<IActionResult> PutOldillnesshistory(decimal PatientId, decimal IllnessId, Oldillnesshistory oldillnesshistory)
        {
            if (IllnessId != oldillnesshistory.IllnessId || PatientId != oldillnesshistory.PatientId)
            {
                return BadRequest();
            }

            if (! await OldillnesshistoryExists(oldillnesshistory.IllnessId, oldillnesshistory.PatientId))
            {
                return NotFound();
                
            }

            try
            {
                _repository.Update(oldillnesshistory);
                await _repository.Save();
            }
            catch (DbUpdateConcurrencyException e)
            {
                return StatusCode(500, e.Message);
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
            catch (DbUpdateException e)
            {
                if (!await OldillnesshistoryExists(oldillnesshistory.IllnessId, oldillnesshistory.PatientId))
                {
                    return Conflict();
                }
                return StatusCode(500, e.Message);
            }

            return Created("", oldillnesshistory);
        }

        // DELETE: api/Oldillnesshistories/5
        [HttpDelete("{PatientId}/{IlnessId}")]
        public async Task<ActionResult<Oldillnesshistory>> DeleteOldillnesshistory(decimal PatientId, decimal IlnessId)
        {
            var oldillnesshistory = await _repository.GetByID(IlnessId, PatientId);
            if (oldillnesshistory == null)
            {
                return NotFound();
            }

            try
            {
                _repository.Delete(oldillnesshistory);
                await _repository.Save();
            }
            catch (OracleException e)
            {
                return StatusCode(500, e.Message);
            }

            return oldillnesshistory;
        }

        private Task<bool> OldillnesshistoryExists(decimal IlnessId, decimal PatientId)
        {
            return _repository.Exists(IlnessId, PatientId);
        }
    }
}
