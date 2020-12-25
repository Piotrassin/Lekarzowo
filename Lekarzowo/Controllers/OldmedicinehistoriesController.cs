using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Lekarzowo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OldmedicinehistoriesController : ControllerBase
    {
        private readonly IOldMedicinesHistoryRepository _repository;

        public OldmedicinehistoriesController(IOldMedicinesHistoryRepository repository)
        {
            _repository = repository;
        }

        // GET: api/Oldmedicinehistories
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Oldmedicinehistory>>> GetOldmedicinehistory()
        {
            return Ok(await _repository.GetAll());
        }

        // GET: api/Oldmedicinehistories/5/5
        [HttpGet("{PatientId}/{MedicineId}")]
        public async Task<ActionResult<Oldmedicinehistory>> GetOldmedicinehistory(decimal PatientId, decimal MedicineId)
        {
            var oldmedicinehistory = await _repository.GetByID(MedicineId, PatientId);

            if (oldmedicinehistory == null)
            {
                return NotFound();
            }

            return oldmedicinehistory;
        }

        // PUT: api/Oldmedicinehistories/5
        [HttpPut("{PatientId}/{MedicineId}")]
        public async Task<IActionResult> PutOldmedicinehistory(decimal PatientId, decimal MedicineId, Oldmedicinehistory oldmedicinehistory)
        {
            if (PatientId != oldmedicinehistory.PatientId || MedicineId != oldmedicinehistory.MedicineId)
            {
                return BadRequest();
            }

            if (!await OldmedicinehistoryExists(oldmedicinehistory.MedicineId, oldmedicinehistory.PatientId))
            {
                return NotFound();
            }

            try
            {
                _repository.Update(oldmedicinehistory);
                await _repository.Save();
            }
            catch (DbUpdateConcurrencyException e)
            {
                return StatusCode(500, e.Message);
            }

            return NoContent();
        }

        // POST: api/Oldmedicinehistories
        [HttpPost]
        public async Task<ActionResult<Oldmedicinehistory>> PostOldmedicinehistory(Oldmedicinehistory oldmedicinehistory)
        {
            await _repository.Insert(oldmedicinehistory);
            try
            {
                await _repository.Save();
            }
            catch (DbUpdateException e)
            {
                if (!await OldmedicinehistoryExists(oldmedicinehistory.MedicineId, oldmedicinehistory.PatientId))
                {
                    return Conflict();
                }
                return StatusCode(500, e.Message);
            }

            return Created("", oldmedicinehistory);
        }

        // DELETE: api/Oldmedicinehistories/5
        [HttpDelete("{PatientId}/{MedicineId}")]
        public async Task<ActionResult<Oldmedicinehistory>> DeleteOldmedicinehistory(decimal PatientId, decimal MedicineId)
        {
            var oldmedicinehistory = await _repository.GetByID(MedicineId, PatientId);
            if (oldmedicinehistory == null)
            {
                return NotFound();
            }

            _repository.Delete(oldmedicinehistory);
            await _repository.Save();

            return oldmedicinehistory;
        }

        private Task<bool> OldmedicinehistoryExists(decimal MedicineId, decimal PatientId)
        {
            return _repository.Exists(MedicineId, PatientId);
        }
    }
}
