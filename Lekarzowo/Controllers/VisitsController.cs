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
        private readonly ISQLPerspectivesRepository _repositorySQL;

        public VisitsController(IVisitsRepository repository, ISQLPerspectivesRepository repositorySQL)
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

            if (_repository.GetByID(visit.ReservationId) != null)
            {
                _repository.Update(visit);
            }

            try
            {
                _repository.Save();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VisitExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
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
            _repository.Insert(visit);
            _repository.Save();

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

        // GET: api/Visits/Details/1
        [HttpGet("[action]/{ReservationId}")]
        public async Task<ActionResult<IEnumerable<View_VisitDetails>>> Details(decimal ReservationId)
        {
            return Ok(await _repositorySQL.VisitDetails(ReservationId));
        }

        // GET: api/Visits/List/1
        [HttpGet("[action]/{PatientId}")]
        public async Task<ActionResult<IEnumerable<View_VisitList>>> List(decimal PatientId)
        {
            return Ok(await _repositorySQL.VisitList(PatientId));
        }

        // to chyba można wywalić
        private bool VisitExists(decimal id)
        {
            return _repository.Exists(id);
        }
    }
}
