using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Lekarzowo.DataAccessLayer.Repositories;

namespace Lekarzowo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VisitsController : BaseController
    {
        private readonly IVisitsRepository _repository;
        private readonly ITreatmentsOnVisitRepository _treatmentsOnVisitRepository;
        private readonly IDoctorsRepository _doctorsRepository;
        private readonly IReservationsRepository _reservationsRepository;
        private static readonly int visitStatusChangeTimeOffsetMinutes = 30;

        public VisitsController(IVisitsRepository repository, ITreatmentsOnVisitRepository treatmentsOnVisitRepository, IDoctorsRepository doctorsRepository, IReservationsRepository reservationsRepository)
        {
            _repository = repository;
            _treatmentsOnVisitRepository = treatmentsOnVisitRepository;
            _doctorsRepository = doctorsRepository;
            _reservationsRepository = reservationsRepository;
        }

        // GET: api/Visits
        [Authorize(Roles = "doctor,admin")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Visit>>> GetVisit()
        {
            return Ok(_repository.GetAll());
        }

        // GET: api/Visits/5
        [Authorize(Roles = "patient,doctor,admin")]
        [HttpGet("{id}")]
        public async Task<ActionResult<Visit>> GetVisit(decimal id)
        {
            var visit = _repository.GetByID(id);

            if (visit == null)
            {
                return NotFound();
            }

            return visit;
        }

        // PUT: api/Visits/5
        [Authorize(Roles = "doctor,admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutVisit(decimal id, Visit visit)
        {
            if (id != visit.ReservationId)
            {
                return BadRequest();
            }
            if (!VisitExists(id))
            {
                return NotFound();
            }

            //TODO PRZETESOWAĆ
            visit.Price = await UpdateVisitPrice(visit.ReservationId);
            
            try
            {
                _repository.Update(visit);
                _repository.Save();
            }
            catch (DbUpdateConcurrencyException e)
            {
                return StatusCode(500, new JsonResult(e.Message));
            }

            return NoContent();
        }

        // POST: api/Visits
        [Authorize(Roles = "doctor,admin")]
        [HttpPost]
        public async Task<ActionResult<Visit>> PostVisit(Visit visit)
        {
            if (VisitExists(visit.ReservationId))
            {
                return Conflict(new JsonResult("That visit already exists"));
            }

            visit.OnGoing = true;
            try
            {
                _repository.Insert(visit);
                _repository.Save();
            }
            catch (DbUpdateException e)
            {
                return StatusCode(500, new JsonResult(e.Message));
            }

            return Created("", visit);
        }

        // DELETE: api/Visits/5
        [Authorize(Roles = "doctor,admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult<Visit>> DeleteVisit(decimal id)
        {
            var visit = _repository.GetByID(id);
            if (visit == null)
            {
                return NotFound();
            }

            try
            {
                _repository.Delete(visit);
                _repository.Save();
            }
            catch (DbUpdateException e)
            {
                return StatusCode(500, new JsonResult(e.Message));
            }

            return visit;
        }

        // GET: api/Visits/OnGoing/5
        [Authorize(Roles = "doctor,admin")]
        [HttpGet("[action]/{doctorId}")]
        public async Task<IActionResult> OnGoing(decimal doctorId)
        {
            var visit = await _repository.OnGoingVisit(doctorId);
            if (visit == null)
            {
                return NotFound();
            }
            return Ok(visit);
        }

        // PUT: api/Visits/ChangeStatus?visitId=5&isOnGoing=true
        [Authorize(Roles = "doctor,admin")]
        [HttpPut("[action]")]
        public async Task<IActionResult> ChangeStatus(decimal visitId, bool isOnGoing)
        {
            var visit = _repository.GetByID(visitId);
            if (visit == null)
            {
                return NotFound();
            }

            if (!await CanVisitBeOpened(visitId))
            {
                return BadRequest();
            }

            visit.OnGoing = isOnGoing;
            return await PutVisit(visitId, visit);
        }

        // GET: api/Visits/CanBeOpened/5
        [Authorize(Roles = "doctor,admin")]
        [HttpGet("[action]/{visitId}")]
        public async Task<IActionResult> CanBeOpened(decimal visitId)
        {
            if(await CanVisitBeOpened(visitId))
            {
                return Ok(new JsonResult(true));
            }
            return Ok(new JsonResult(false));
        }

        private bool VisitExists(decimal id)
        {
            return _repository.Exists(id);
        }

        private async Task<bool> CanVisitBeOpened(decimal visitId)
        {
            var visit = _repository.GetByID(visitId);
            if (visit == null)
            {
                return false;
            }
            var onGoingVisits = await _repository.OnGoingVisitsToday(visit.Reservation.DoctorId);

            if (visit.Reservation.Starttime > DateTime.Now.AddMinutes(visitStatusChangeTimeOffsetMinutes) ||
                visit.Reservation.Endtime < DateTime.Now.AddMinutes(-visitStatusChangeTimeOffsetMinutes) || 
                (onGoingVisits.Any() && !onGoingVisits.Contains(visit)))
            {
                return false;
            }
            return true;
        }

        private async Task<decimal> UpdateVisitPrice(decimal visitId)
        {
            decimal sum = 0;

            var doctor = await _reservationsRepository.GetById(visitId);
            var specPrice = (await _doctorsRepository.GetByIdWithSpecialization(doctor.DoctorId)).Speciality.Price;
            sum += specPrice;

            var treatments = await _treatmentsOnVisitRepository.PerformedTreatmentsAsTreatments(visitId);
            sum += treatments.Sum(treatment => treatment.Treatment.Price);

            return sum;
        }
    }
}
