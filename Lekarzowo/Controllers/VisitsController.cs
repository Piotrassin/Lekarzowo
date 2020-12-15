using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Lekarzowo.Models;
using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;


namespace Lekarzowo.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class VisitsController : BaseController
    {
        private readonly IVisitsRepository _repository;

        public VisitsController(IVisitsRepository repository)
        {
            _repository = repository;
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
            try
            {
                _repository.Update(visit);
                _repository.Save();
            }
            catch (DbUpdateConcurrencyException e)
            {
                return StatusCode(500, e.Message);
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
                return Conflict("That visit already exists");
            }

            try
            {
                _repository.Insert(visit);
                _repository.Save();
            }
            catch (DbUpdateException e)
            {
                return StatusCode(500, e.Message);
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

            _repository.Delete(visit);
            _repository.Save();

            return visit;
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
            var onGoingVisits = await _repository.OnGoingVisits(visit.Reservation.DoctorId);

            if (visit.Reservation.Starttime > DateTime.Now.AddMinutes(30) ||
                visit.Reservation.Endtime < DateTime.Now.AddMinutes(-30))
            {
                return BadRequest();
            }

            if (onGoingVisits.Any() && !onGoingVisits.Contains(visit))
            {
                return BadRequest();
            }

            visit.OnGoing = isOnGoing;
            return await PutVisit(visitId, visit);
        }

        private bool VisitExists(decimal id)
        {
            return _repository.Exists(id);
        }

    }
}
