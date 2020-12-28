using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

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
        [Authorize(Roles = "patient,doctor,admin")]
        [HttpGet("{PatientId}")]
        public async Task<ActionResult<IEnumerable<Oldillnesshistory>>> GetOldillnesshistory()
        {
            return Ok(await _repository.GetAll());
        }

        // GET: api/Oldillnesshistories/5
        [Authorize(Roles = "patient,doctor,admin")]
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
        [Authorize(Roles = "doctor,admin")]
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
                return StatusCode(500, new JsonResult(e.Message));
            }

            return NoContent();
        }

        // POST: api/Oldillnesshistories
        [Authorize(Roles = "doctor,admin")]
        [HttpPost]
        public async Task<ActionResult<Oldillnesshistory>> PostOldillnesshistory(Oldillnesshistory oldillnesshistory)
        {
            if (await OldillnesshistoryExists(oldillnesshistory.IllnessId, oldillnesshistory.PatientId))
            {
                return Conflict(new JsonResult("Old illness history with that name already exists"));
            }

            try
            {
                await _repository.Insert(oldillnesshistory);
                await _repository.Save();
            }
            catch (DbUpdateException e)
            {
                return StatusCode(500, new JsonResult(e.Message));
            }

            return Created("", oldillnesshistory);
        }

        // DELETE: api/Oldillnesshistories/5
        [Authorize(Roles = "doctor,admin")]
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
            catch (DbUpdateException e)
            {
                return StatusCode(500, new JsonResult(e.Message));
            }

            return oldillnesshistory;
        }

        private Task<bool> OldillnesshistoryExists(decimal IlnessId, decimal PatientId)
        {
            return _repository.Exists(IlnessId, PatientId);
        }
    }
}
