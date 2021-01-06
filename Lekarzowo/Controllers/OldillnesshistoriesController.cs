using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using Lekarzowo.Services;
using Microsoft.AspNetCore.Authorization;

namespace Lekarzowo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OldillnesshistoriesController : BaseController
    {
        private readonly IOldIllnessesHistoryRepository _repository;
        private readonly IPatientsRepository _patientsRepository;
        private readonly AuthorizationService _authorizationService;

        public OldillnesshistoriesController(IOldIllnessesHistoryRepository repository, IPatientsRepository patientsRepository, AuthorizationService authorizationService)
        {
            _repository = repository;
            _patientsRepository = patientsRepository;
            _authorizationService = authorizationService;
        }

        // GET: api/Oldillnesshistories
        [Authorize(Roles = "admin")]
        [HttpGet("{PatientId}")]
        public async Task<ActionResult<IEnumerable<Oldillnesshistory>>> GetOldillnesshistory()
        {
            return Ok(await _repository.GetAll());
        }

        // GET: api/Oldillnesshistories/5
        [Authorize(Roles = "patient,doctor,admin")]
        [HttpGet("{patientId}/{illnessId}")]
        public async Task<ActionResult<Oldillnesshistory>> GetOldillnesshistory(decimal patientId, decimal illnessId)
        {
            if (!_patientsRepository.Exists(patientId))
            {
                return NotFound(NotFoundEmptyJsonResult);
            }
            if (! await _authorizationService.CanUserAccessPatientData(patientId, this))
            {
                return Unauthorized(UnauthorizedEmptyJsonResult);
            }

            var oldillnesshistory = await _repository.GetByID(illnessId, patientId);

            if (oldillnesshistory == null)
            {
                return NotFound(NotFoundEmptyJsonResult);
            }

            return oldillnesshistory;
        }

        // PUT: api/Oldillnesshistories/5/1
        [Authorize(Roles = "doctor,admin")]
        [HttpPut("{patientId}/{illnessId}")]
        public async Task<IActionResult> PutOldillnesshistory(decimal patientId, decimal illnessId, Oldillnesshistory oldillnesshistory)
        {
            if (illnessId != oldillnesshistory.IllnessId || patientId != oldillnesshistory.PatientId)
            {
                return BadRequest(BadRequestEmptyJsonResult);
            }
            if (! await OldillnesshistoryExists(oldillnesshistory.IllnessId, oldillnesshistory.PatientId))
            {
                return NotFound(NotFoundEmptyJsonResult);
            }
            if (!await _authorizationService.CanUserAccessPatientData(patientId, this))
            {
                return Unauthorized(UnauthorizedEmptyJsonResult);
            }

            try
            {
                _repository.Update(oldillnesshistory);
                await _repository.Save();
            }
            catch (DbUpdateConcurrencyException e)
            {
                return StatusCode(500, InternalServerErrorJsonResult(e.Message));
            }

            return Ok(OkEmptyJsonResult);
        }

        // POST: api/Oldillnesshistories
        [Authorize(Roles = "doctor,admin")]
        [HttpPost]
        public async Task<ActionResult<Oldillnesshistory>> PostOldillnesshistory(Oldillnesshistory oldillnesshistory)
        {
            if (!_patientsRepository.Exists(oldillnesshistory.PatientId))
            {
                return NotFound(NotFoundEmptyJsonResult);
            }
            if (!await _authorizationService.CanUserAccessPatientData(oldillnesshistory.PatientId, this))
            {
                return Unauthorized(UnauthorizedEmptyJsonResult);
            }
            if (await OldillnesshistoryExists(oldillnesshistory.IllnessId, oldillnesshistory.PatientId))
            {
                return Conflict(ConflictJsonResult("Old illness history with that illness and patient already exists"));
            }

            try
            {
                await _repository.Insert(oldillnesshistory);
                await _repository.Save();
            }
            catch (DbUpdateException e)
            {
                return StatusCode(500, InternalServerErrorJsonResult(e.Message));
            }

            return Created("", oldillnesshistory);
        }

        // DELETE: api/Oldillnesshistories/5
        [Authorize(Roles = "doctor,admin")]
        [HttpDelete("{patientId}/{illnessId}")]
        public async Task<ActionResult<Oldillnesshistory>> DeleteOldillnesshistory(decimal patientId, decimal illnessId)
        {
            var oldillnesshistory = await _repository.GetByID(illnessId, patientId);
            if (oldillnesshistory == null)
            {
                return NotFound(NotFoundEmptyJsonResult);
            }
            if (!await _authorizationService.CanUserAccessPatientData(oldillnesshistory.PatientId, this))
            {
                return Unauthorized(UnauthorizedEmptyJsonResult);
            }

            try
            {
                _repository.Delete(oldillnesshistory);
                await _repository.Save();
            }
            catch (DbUpdateException e)
            {
                return StatusCode(500, InternalServerErrorJsonResult(e.Message));
            }

            return oldillnesshistory;
        }

        private Task<bool> OldillnesshistoryExists(decimal ilnessId, decimal patientId)
        {
            return _repository.Exists(ilnessId, patientId);
        }
    }
}
