using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;

namespace Lekarzowo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TreatmentonvisitsController : ControllerBase
    {
        private readonly ITreatmentsOnVisitRepository _repository;

        public TreatmentonvisitsController(ITreatmentsOnVisitRepository repository)
        {
            _repository = repository;
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

            return treatmentonvisit;
        }

        // GET: api/Treatmentonvisits/PerformedTreatments?visitId=1&limit=10&skip=1
        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<object>>> PerformedTreatments(decimal visitId, int? limit, int? skip)
        {
            return Ok(await _repository.PerformedTreatments(visitId, limit, skip));
        }

        // PUT: api/Treatmentonvisits/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTreatmentonvisit(decimal id, Treatmentonvisit treatmentonvisit)
        {
            if (id != treatmentonvisit.Id)
            {
                return BadRequest();
            }

            if (_repository.GetByID(treatmentonvisit.Id) != null)
            {
                _repository.Update(treatmentonvisit);
            }

            try
            {
                _repository.Save();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TreatmentonvisitExists(id))
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

        // POST: api/Treatmentonvisits
        [HttpPost]
        public async Task<ActionResult<Treatmentonvisit>> PostTreatmentonvisit(Treatmentonvisit treatmentonvisit)
        {
            if (TreatmentonvisitExists(treatmentonvisit.Id))
            {
                return Conflict("That treatment on visit already exists");
            }
            _repository.Insert(treatmentonvisit);
            _repository.Save();

            return Created("", treatmentonvisit);
        }

        // DELETE: api/Treatmentonvisits/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Treatmentonvisit>> DeleteTreatmentonvisit(decimal id)
        {
            var treatmentonvisit = _repository.GetByID(id);
            if (treatmentonvisit == null)
            {
                return NotFound();
            }

            _repository.Delete(treatmentonvisit);
            _repository.Save();

            return treatmentonvisit;
        }

        private bool TreatmentonvisitExists(decimal id)
        {
            return _repository.Exists(id);
        }
    }
}
