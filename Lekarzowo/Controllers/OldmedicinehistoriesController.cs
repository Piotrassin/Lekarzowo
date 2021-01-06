using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using Lekarzowo.Services;

namespace Lekarzowo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OldmedicinehistoriesController : BaseController
    {
        private readonly IOldMedicinesHistoryRepository _repository;
        private readonly IPatientsRepository _patientsRepository;
        private readonly AuthorizationService _authorizationService;

        public OldmedicinehistoriesController(IOldMedicinesHistoryRepository repository, IPatientsRepository patientsRepository, AuthorizationService authorizationService)
        {
            _repository = repository;
            _patientsRepository = patientsRepository;
            _authorizationService = authorizationService;
        }

        // GET: api/Oldmedicinehistories
        [Authorize(Roles = "admin")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Oldmedicinehistory>>> GetOldmedicinehistory()
        {
            return Ok(await _repository.GetAll());
        }

        // GET: api/Oldmedicinehistories/5/5
        [Authorize(Roles = "patient,doctor,admin")]
        [HttpGet("{patientId}/{medicineId}")]
        public async Task<ActionResult<Oldmedicinehistory>> GetOldmedicinehistory(decimal patientId, decimal medicineId)
        {
            if (!_patientsRepository.Exists(patientId))
            {
                return NotFound(NotFoundEmptyJsonResult);
            }
            if (! await _authorizationService.CanUserAccessPatientData(patientId, this))
            {
                return Unauthorized(UnauthorizedEmptyJsonResult);
            }

            var oldmedicinehistory = await _repository.GetByID(medicineId, patientId);

            if (oldmedicinehistory == null)
            {
                return NotFound(NotFoundEmptyJsonResult);
            }

            return oldmedicinehistory;
        }

        // PUT: api/Oldmedicinehistories/5
        [Authorize(Roles = "doctor,admin")]
        [HttpPut("{patientId}/{medicineId}")]
        public async Task<IActionResult> PutOldmedicinehistory(decimal patientId, decimal medicineId, Oldmedicinehistory oldmedicinehistory)
        {
            if (patientId != oldmedicinehistory.PatientId || medicineId != oldmedicinehistory.MedicineId)
            {
                return BadRequest(BadRequestEmptyJsonResult);
            }
            if (!await OldmedicinehistoryExists(oldmedicinehistory.MedicineId, oldmedicinehistory.PatientId))
            {
                return NotFound(NotFoundEmptyJsonResult);
            }
            if (!await _authorizationService.CanUserAccessPatientData(patientId, this))
            {
                return Unauthorized(UnauthorizedEmptyJsonResult);
            }


            try
            {
                _repository.Update(oldmedicinehistory);
                await _repository.Save();
            }
            catch (DbUpdateConcurrencyException e)
            {
                return StatusCode(500, InternalServerErrorJsonResult(e.Message));
            }

            return Ok(OkEmptyJsonResult);
        }

        // POST: api/Oldmedicinehistories
        [Authorize(Roles = "doctor,admin")]
        [HttpPost]
        public async Task<ActionResult<Oldmedicinehistory>> PostOldmedicinehistory(Oldmedicinehistory oldmedicinehistory)
        {
            if (!_patientsRepository.Exists(oldmedicinehistory.PatientId))
            {
                return NotFound(NotFoundEmptyJsonResult);
            }
            if (!await _authorizationService.CanUserAccessPatientData(oldmedicinehistory.PatientId, this))
            {
                return Unauthorized(UnauthorizedEmptyJsonResult);
            }
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
                return StatusCode(500, InternalServerErrorJsonResult(e.Message));
            }

            return Created("", oldmedicinehistory);
        }

        // DELETE: api/Oldmedicinehistories/5
        [Authorize(Roles = "doctor,admin")]
        [HttpDelete("{patientId}/{medicineId}")]
        public async Task<ActionResult<Oldmedicinehistory>> DeleteOldmedicinehistory(decimal patientId, decimal medicineId)
        {
            var oldmedicinehistory = await _repository.GetByID(medicineId, patientId);
            if (oldmedicinehistory == null)
            {
                return NotFound(NotFoundEmptyJsonResult);
            }
            if (!await _authorizationService.CanUserAccessPatientData(oldmedicinehistory.PatientId, this))
            {
                return Unauthorized(UnauthorizedEmptyJsonResult);
            }

            try
            {
                _repository.Delete(oldmedicinehistory);
                await _repository.Save();
            }
            catch (DbUpdateException e)
            {
                return StatusCode(500, InternalServerErrorJsonResult(e.Message));
            }

            return oldmedicinehistory;
        }

        private Task<bool> OldmedicinehistoryExists(decimal medicineId, decimal patientId)
        {
            return _repository.Exists(medicineId, patientId);
        }
    }
}
