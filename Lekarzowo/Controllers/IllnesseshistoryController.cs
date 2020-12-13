using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IllnesseshistoryController : BaseController
    {
        private readonly IIllnessesHistoryRepository _repository;

        public IllnesseshistoryController(IIllnessesHistoryRepository context)
        {
            _repository = context;
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
                return BadRequest();
            }

            var illnesshistory = _repository.GetByID(illnessHistoryId);
            if(illnesshistory == null)
            {
                return NotFound();
            }

            return illnesshistory;
        }

        // GET: api/Illnesseshistory/AllByPatientId/5
        [Authorize(Roles = "patient,doctor,admin")]
        [HttpGet("[action]/{patientId}")]
        public ActionResult<IEnumerable<Illnesshistory>> AllByPatientId(decimal patientId)
        {
            if (IsPatientAskingForElsesData(patientId)) return BadRequest();

            var illnesshistory = _repository.GetAll(patientId);

            if (illnesshistory == null)
            {
                return NotFound();
            }
            return illnesshistory.ToList();
        }

        // GET: api/Illnesseshistory/AllByVisitId?visitId=1&limit=10&skip=1
        [Authorize(Roles = "patient,doctor,admin")]
        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<object>>> AllByVisitId(decimal visitId, int? limit, int? skip)
        {
            if (IsPatient() && _repository.GetAll(GetUserIdFromToken()).All(x => x.VisitId != visitId))
            {
                return BadRequest();
            }

            var illnesshistory = await _repository.AllByVisitId(visitId, limit, skip);

            if (illnesshistory == null)
            {
                return NotFound();
            }

            return  illnesshistory.ToList();
        }

        // GET: api/Illnesseshistory/PatientHistory?patientId=1&limit=10&skip=2
        [Authorize(Roles = "patient,doctor,admin")]
        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<object>>> PatientHistory(decimal patientId, int? limit, int? skip)
        {
            if (IsPatientAskingForElsesData(patientId)) return BadRequest();

            return Ok(await _repository.AllByPatientId(patientId, limit, skip));
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

            try
            {
                if (!IllnesshistoryExists(illnesshistory.Id)) return NotFound();

                _repository.Update(illnesshistory);
                _repository.Save(); 
                return NoContent();
            }
            catch (DbUpdateConcurrencyException e)
            {
                return StatusCode(500, e.Message);
            }
        }

        // POST: api/Illnesseshistory
        [Authorize(Roles = "doctor,admin")]
        [HttpPost]
        public ActionResult<Illnesshistory> PostIllnesshistory(Illnesshistory illnesshistory)
        {
            if (_repository.Exists(illnesshistory))
            {
                return Conflict("That illness history already exists");
            }
            try
            {
                _repository.Insert(illnesshistory);
                _repository.Save();
            }
            catch (DbUpdateException e)
            {
                return StatusCode(500, e.Message);
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

            _repository.Delete(illnesshistory);
            _repository.Save();

            return illnesshistory;
        }

        private bool IllnesshistoryExists(decimal id)
        {
            return _repository.Exists(id);
        }

        private bool IsPatientAskingForElsesData(decimal patientId)
        {
            return IsPatient() && patientId != GetUserIdFromToken();
        }

    }
}
