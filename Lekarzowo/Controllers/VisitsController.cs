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

namespace Lekarzowo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VisitsController : ControllerBase
    {
        private readonly IVisitsRepository _repository;
        private readonly IUserInterfaceComponentsRepository _repositorySQL;

        public VisitsController(IVisitsRepository repository, IUserInterfaceComponentsRepository repositorySQL)
        {
            _repository = repository;
            _repositorySQL = repositorySQL;
        }

        // GET: api/Visits
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Visit>>> GetVisit()
        {
            return Ok(_repository.GetAll());
        }

        // GET: api/Visits/5
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
        [HttpPut("[action]")]
        public async Task<IActionResult> ChangeStatus(decimal visitId, bool isOnGoing)
        {
            var visit = _repository.GetByID(visitId);
            if (visit == null)
            {
                return NotFound();
            }

            if (visit.Reservation.Starttime > DateTime.Now.AddMinutes(30) || 
                visit.Reservation.Endtime < DateTime.Now.AddMinutes(-30))
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
