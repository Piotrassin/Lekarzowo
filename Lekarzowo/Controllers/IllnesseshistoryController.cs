using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Lekarzowo.Services;

namespace Lekarzowo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IllnesseshistoryController : BaseController
    {
        private readonly IIllnessesHistoryRepository _repository;
        private readonly IVisitsRepository _visitsRepository;
        private readonly IOldIllnessesHistoryRepository _oldIllnessesHistoryRepository;


        public IllnesseshistoryController(IIllnessesHistoryRepository context, IVisitsRepository visitsRepository, IOldIllnessesHistoryRepository oldIllnessesHistoryRepository)
        {
            _repository = context;
            _visitsRepository = visitsRepository;
            _oldIllnessesHistoryRepository = oldIllnessesHistoryRepository;
        }

        // GET: api/Illnesseshistory
        [Authorize(Roles = "doctor,admin")]
        [HttpGet]
        public ActionResult<IEnumerable<Illnesshistory>> GetIllnesshistories()
        {
            return _repository.GetAll().ToList();
        }

        // GET: api/Illnesseshistory/Single/5
        [Authorize(Roles = "patient,doctor,admin")]
        [HttpGet("[action]/{illnessHistoryId}")]
        public ActionResult<Illnesshistory> Single(decimal illnessHistoryId)
        {
            if (IsPatient() && _repository.GetAll(GetUserIdFromToken()).All(x => x.Id != illnessHistoryId))
            {
                return Unauthorized();
            }

            var illnesshistory = _repository.GetByID(illnessHistoryId);
            if(illnesshistory == null)
            {
                return NotFound();
            }

            return illnesshistory;
        }

        // GET: api/Illnesseshistory/AllByPatientId
        [Authorize(Roles = "patient,doctor,admin")]
        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<object>>> AllByPatientId(decimal patientId, int? limit, int? skip)
        {
            if (IsPatientAccessingElsesData(patientId))
            {
                return Unauthorized();
            }
            //if (IsPatientAskingForElsesData(patientId)) return Unauthorized();

            var illnesshistory = _repository.GetAllWithAdditionalInfo(patientId); 
            
            if (illnesshistory == null)
            {
                return NotFound();
            }

            var enumerableHistory = PaginationService<object>.SplitAndLimitIEnumerable(skip, limit, illnesshistory);

            return enumerableHistory.ToList();
        }

        // GET: api/Illnesseshistory/AllByVisitId?visitId=1&limit=10&skip=1
        [Authorize(Roles = "patient,doctor,admin")]
        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<object>>> AllByVisitId(decimal visitId, int? limit, int? skip)
        {
            if (IsPatient() && _repository.GetAll(GetUserIdFromToken()).All(x => x.VisitId != visitId))
            {
                return Unauthorized();
            }

            var illnesshistory = await _repository.AllByVisitId(visitId, limit, skip);

            if (illnesshistory == null)
            {
                return NotFound();
            }

            return  illnesshistory.ToList();
        }

        // GET: api/Illnesseshistory/AllByNameOnAVisit?visitId=1&name=abc&limit=0&skip=0
        [Authorize(Roles = "patient,doctor,admin")]
        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<Illness>>> AllByNameOnAVisit(decimal visitId, string name, int? limit, int? skip)
        {
            var patientId = _visitsRepository.GetByID(visitId).Reservation.PatientId;

            if (IsPatientAccessingElsesData(patientId))
            {
                return Unauthorized();
            }

            return Ok(await _repository.AllByNameOnVisit(visitId, name, limit, skip));
        }

        // GET: api/Illnesseshistory/PatientHistory?patientId=1&limit=10&skip=2
        [Authorize(Roles = "patient,doctor,admin")]
        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<object>>> PatientHistory(decimal patientId, int? limit, int? skip)
        {
            if (IsPatientAccessingElsesData(patientId))
            {
                return Unauthorized();
            }

            var illnessHistory = await _repository.PatientHistory(patientId);
            var oldillnesshistory = await _oldIllnessesHistoryRepository.GetAllSpecificData(patientId);

            List<object> patientsHistory = new List<object>();
            patientsHistory.AddRange(illnessHistory);
            patientsHistory.AddRange(oldillnesshistory);

            IEnumerable<object> enumerableHistory = patientsHistory;
            enumerableHistory = PaginationService<object>.SplitAndLimitIEnumerable(skip, limit, enumerableHistory);

            return Ok(enumerableHistory);
        }

        // PUT: api/Illnesseshistory/5
        [Authorize(Roles = "doctor,admin")]
        [HttpPut("{illnessHistoryId}")]
        public IActionResult PutIllnesshistory(decimal illnessHistoryId, Illnesshistory illnesshistory)
        {
            if (illnessHistoryId != illnesshistory.Id)
            {
                return BadRequest();
            }

            if (!IllnesshistoryExists(illnesshistory.Id))
            {
                return NotFound();
            }

            try
            {
                _repository.Update(illnesshistory);
                _repository.Save();
            }
            catch (DbUpdateConcurrencyException e)
            {
                return StatusCode(500, new JsonResult(e.Message));
            }

            return NoContent();
        }

        // POST: api/Illnesseshistory
        [Authorize(Roles = "doctor,admin")]
        [HttpPost]
        public async Task<ActionResult<Illnesshistory>> PostIllnesshistory(Illnesshistory illnesshistory)
        {
            var visit = _visitsRepository.GetByID(illnesshistory.VisitId);

            if ((await _repository.GetByVisitId(visit.ReservationId)).Contains(illnesshistory))
            {
                return Conflict(new JsonResult("That illness history already exists"));
            }

            try
            {
                _repository.Insert(illnesshistory);
                _repository.Save();
            }
            catch (DbUpdateException e)
            {
                return StatusCode(500, new JsonResult(e.Message));
            }
            return Created("", illnesshistory);
        }

        // DELETE: api/Illnesseshistory/5
        [Authorize(Roles = "doctor,admin")]
        [HttpDelete("{illnessHistoryId}")]
        public ActionResult<Illnesshistory> DeleteIllnesshistory(decimal illnessHistoryId)
        {
            var illnesshistory = _repository.GetByID(illnessHistoryId);
            if (illnesshistory == null)
            {
                return NotFound();
            }

            try
            {
                _repository.Delete(illnesshistory);
                _repository.Save();
            }
            catch (DbUpdateException e)
            {
                return StatusCode(500, new JsonResult(e.Message));
            }

            return illnesshistory;
        }

        private bool IllnesshistoryExists(decimal id)
        {
            return _repository.Exists(id);
        }

    }
}
