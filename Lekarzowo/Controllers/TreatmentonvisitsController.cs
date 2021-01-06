using System;
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
    [Authorize(Roles = "patient,doctor,admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class TreatmentonvisitsController : BaseController
    {
        private readonly ITreatmentsOnVisitRepository _repository;
        private readonly IVisitsRepository _visitsRepository;
        private readonly AuthorizationService _authorizationService;


        public TreatmentonvisitsController(ITreatmentsOnVisitRepository repository, IVisitsRepository visitsRepository, AuthorizationService authorizationService)
        {
            _repository = repository;
            _visitsRepository = visitsRepository;
            _authorizationService = authorizationService;
        }

        // GET: api/Treatmentonvisits
        [Authorize(Roles = "admin")]
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
                return NotFound(NotFoundEmptyJsonResult);
            }
            if (! await _authorizationService.CanUserAccessVisit(treatmentonvisit.VisitId, this))
            {
                return Unauthorized(UnauthorizedEmptyJsonResult);
            }

            return treatmentonvisit;
        }

        // GET: api/Treatmentonvisits/PerformedTreatments?visitId=1&limit=10&skip=1
        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<object>>> PerformedTreatments(decimal visitId, int? limit, int? skip)
        {
            if (!_visitsRepository.Exists(visitId))
            {
                return NotFound(NotFoundEmptyJsonResult);
            }
            if (! await _authorizationService.CanUserAccessVisit(visitId, this))
            {
                return Unauthorized(UnauthorizedEmptyJsonResult);
            }

            return Ok(await _repository.PerformedTreatments(visitId, limit, skip));
        }

        // PUT: api/Treatmentonvisits/5
        [Authorize(Roles = "doctor,admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTreatmentonvisit(decimal id, Treatmentonvisit treatmentonvisit)
        {
            if (id != treatmentonvisit.Id)
            {
                return BadRequest(BadRequestEmptyJsonResult);
            }
            if (!TreatmentonvisitExists(id))
            {
                return NotFound(NotFoundEmptyJsonResult);
            }
            var visit = _visitsRepository.GetByID(treatmentonvisit.VisitId);
            if (! await _authorizationService.CanUserAccessPatientData(visit.Reservation.PatientId, this))
            {
                return Unauthorized(UnauthorizedEmptyJsonResult);
            }

            try
            {
                _repository.Update(treatmentonvisit);
                _repository.Save();
            }
            catch (DbUpdateConcurrencyException e)
            {
                return StatusCode(500, InternalServerErrorJsonResult(e.Message));
            }

            return Ok(OkEmptyJsonResult);
        }

        // POST: api/Treatmentonvisits
        [Authorize(Roles = "doctor,admin")]
        [HttpPost]
        public async Task<ActionResult<Treatmentonvisit>> PostTreatmentonvisit(Treatmentonvisit treatmentonvisit)
        {
            var visit = _visitsRepository.GetByID(treatmentonvisit.VisitId);
            if (visit == null)
            {
                return NotFound(NotFoundEmptyJsonResult);
            }
            if (! await _authorizationService.CanUserAccessPatientData(visit.Reservation.PatientId, this))
            {
                return Unauthorized(UnauthorizedEmptyJsonResult);
            }

            treatmentonvisit.Id = Decimal.Zero;
            try
            {
                _repository.Insert(treatmentonvisit);
                _repository.Save();
            }
            catch (DbUpdateException e)
            {
                return StatusCode(500, InternalServerErrorJsonResult(e.Message));
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
                return NotFound(NotFoundEmptyJsonResult);
            }
            var visit = _visitsRepository.GetByID(treatmentonvisit.VisitId);
            if (! await _authorizationService.CanUserAccessPatientData(visit.Reservation.PatientId, this))
            {
                return Unauthorized(UnauthorizedEmptyJsonResult);
            }

            try
            {
                _repository.Delete(treatmentonvisit);
                _repository.Save();
            }
            catch (DbUpdateException e)
            {
                return StatusCode(500, InternalServerErrorJsonResult(e.Message));
            }

            return treatmentonvisit;
        }

        private bool TreatmentonvisitExists(decimal id)
        {
            return _repository.Exists(id);
        }
    }
}
