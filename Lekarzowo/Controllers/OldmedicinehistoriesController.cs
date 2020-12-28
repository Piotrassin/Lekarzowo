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
    public class OldmedicinehistoriesController : ControllerBase
    {
        private readonly IOldMedicinesHistoryRepository _repository;

        public OldmedicinehistoriesController(IOldMedicinesHistoryRepository repository)
        {
            _repository = repository;
        }

        // GET: api/Oldmedicinehistories
        [Authorize(Roles = "patient,doctor,admin")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Oldmedicinehistory>>> GetOldmedicinehistory()
        {
            return Ok(await _repository.GetAll());
        }

        // GET: api/Oldmedicinehistories/5/5
        [Authorize(Roles = "patient,doctor,admin")]
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
        [Authorize(Roles = "doctor,admin")]
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
                return StatusCode(500, new JsonResult(e.Message));
            }

            return NoContent();
        }

        // POST: api/Oldmedicinehistories
        [Authorize(Roles = "doctor,admin")]
        [HttpPost]
        public async Task<ActionResult<Oldmedicinehistory>> PostOldmedicinehistory(Oldmedicinehistory oldmedicinehistory)
        {
            if (await OldmedicinehistoryExists(oldmedicinehistory.MedicineId, oldmedicinehistory.PatientId))
            {
                return Conflict();
            }

            try
            {
                await _repository.Insert(oldmedicinehistory);
                await _repository.Save();
            }
            catch (DbUpdateException e)
            {
                return StatusCode(500, new JsonResult(e.Message));
            }

            return Created("", oldmedicinehistory);
        }

        // DELETE: api/Oldmedicinehistories/5
        [Authorize(Roles = "doctor,admin")]
        [HttpDelete("{PatientId}/{MedicineId}")]
        public async Task<ActionResult<Oldmedicinehistory>> DeleteOldmedicinehistory(decimal PatientId, decimal MedicineId)
        {
            var oldmedicinehistory = await _repository.GetByID(MedicineId, PatientId);
            if (oldmedicinehistory == null)
            {
                return NotFound();
            }

            try
            {
                _repository.Delete(oldmedicinehistory);
                await _repository.Save();
            }
            catch (DbUpdateException e)
            {
                return StatusCode(500, new JsonResult(e.Message));
            }

            return oldmedicinehistory;
        }

        private Task<bool> OldmedicinehistoryExists(decimal MedicineId, decimal PatientId)
        {
            return _repository.Exists(MedicineId, PatientId);
        }
    }
}
