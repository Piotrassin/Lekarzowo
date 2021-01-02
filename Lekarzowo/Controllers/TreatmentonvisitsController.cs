using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Lekarzowo.Controllers
{
    [Authorize(Roles = "patient,doctor,admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class TreatmentonvisitsController : BaseController
    {
        private readonly ITreatmentsOnVisitRepository _repository;
        private readonly IVisitsRepository _visitsRepository;
        private readonly VisitsController _visitsController;


        public TreatmentonvisitsController(ITreatmentsOnVisitRepository repository, IVisitsRepository visitsRepository, VisitsController visitsController)
        {
            _repository = repository;
            _visitsRepository = visitsRepository;
            _visitsController = visitsController;
        }

        // GET: api/Treatmentonvisits
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Treatmentonvisit>>> GetTreatmentonvisit()
        {
            return Ok(_repository.GetAll());
        }

        // GET: api/Treatmentonvisits/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Treatmentonvisit>> GetTreatmentonvisit(decimal id)
        {
            var treatmentonvisit = _repository.GetByID(id);

            if (treatmentonvisit == null)
            {
                return NotFound();
            }
            if (!await _visitsController.IsOwnedByPatientVisit(treatmentonvisit.VisitId))
            {
                return Unauthorized();
            }

            return treatmentonvisit;
        }

        // GET: api/Treatmentonvisits/PerformedTreatments?visitId=1&limit=10&skip=1
        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<object>>> PerformedTreatments(decimal visitId, int? limit, int? skip)
        {
            if (!await _visitsController.IsOwnedByPatientVisit(visitId))
            {
                return Unauthorized();
            }

            return Ok(await _repository.PerformedTreatments(visitId, limit, skip));
        }

        // PUT: api/Treatmentonvisits/5
        [Authorize(Roles = "doctor,admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTreatmentonvisit(decimal id, Treatmentonvisit treatmentonvisit)
        {
            var visit = _visitsRepository.GetByID(treatmentonvisit.VisitId);
            if (UserIsDoctorAndDoesntHaveAccess(visit.Reservation.DoctorId))
            {
                return Unauthorized();
            }

            if (id != treatmentonvisit.Id)
            {
                return BadRequest();
            }
            if (!TreatmentonvisitExists(id))
            {
                return NotFound();
            }

            try
            {
                _repository.Update(treatmentonvisit);
                _repository.Save();
            }
            catch (DbUpdateConcurrencyException e)
            {
                return StatusCode(500, new JsonResult(e.Message));
            }

            return NoContent();
        }

        // POST: api/Treatmentonvisits
        [Authorize(Roles = "doctor,admin")]
        [HttpPost]
        public async Task<ActionResult<Treatmentonvisit>> PostTreatmentonvisit(Treatmentonvisit treatmentonvisit)
        {
            var visit = _visitsRepository.GetByID(treatmentonvisit.VisitId);
            if (UserIsDoctorAndDoesntHaveAccess(visit.Reservation.DoctorId))
            {
                return Unauthorized();
            }
            try
            {
                _repository.Insert(treatmentonvisit);
                _repository.Save();
            }
            catch (DbUpdateException e)
            {
                return StatusCode(500, new JsonResult(e.Message));
            }

            return Created("", treatmentonvisit);
        }

        // DELETE: api/Treatmentonvisits/5
        [Authorize(Roles = "doctor,admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult<Treatmentonvisit>> DeleteTreatmentonvisit(decimal id)
        {
            var treatmentonvisit = _repository.GetByID(id);
            if (treatmentonvisit == null)
            {
                return NotFound();
            }
            var visit = _visitsRepository.GetByID(treatmentonvisit.VisitId);
            if (UserIsDoctorAndDoesntHaveAccess(visit.Reservation.DoctorId))
            {
                return Unauthorized();
            }

            try
            {
                _repository.Delete(treatmentonvisit);
                _repository.Save();
            }
            catch (DbUpdateException e)
            {
                return StatusCode(500, new JsonResult(e.Message));
            }

            return treatmentonvisit;
        }

        private bool TreatmentonvisitExists(decimal id)
        {
            return _repository.Exists(id);
        }
    }
}
