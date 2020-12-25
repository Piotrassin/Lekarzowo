using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Lekarzowo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TreatmentsController : ControllerBase
    {
        private readonly ITreatmentsRepository _repository;

        public TreatmentsController(ITreatmentsRepository repository)
        {
            _repository = repository;
        }

        // GET: api/Treatments
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Treatment>>> GetTreatment()
        {
            return Ok(_repository.GetAll());
        }

        // GET: api/Treatments/AllByName?Name=abc&limit=0&skip=0
        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<Treatment>>> AllByName(string name, int? limit, int? skip)
        {
            return Ok(await _repository.GetAllByName(name, limit, skip));
        }


        // GET: api/Treatments/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Treatment>> GetTreatment(decimal id)
        {
            var treatment = _repository.GetByID(id);

            if (treatment == null)
            {
                return NotFound();
            }

            return treatment;
        }

        // PUT: api/Treatments/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTreatment(decimal id, Treatment treatment)
        {
            if (id != treatment.Id)
            {
                return BadRequest();
            }

            if (_repository.GetByID(treatment.Id) != null)
            {
                _repository.Update(treatment);
            }

            try
            {
                _repository.Save();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TreatmentExists(id))
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

        // POST: api/Treatments
        [HttpPost]
        public async Task<ActionResult<Treatment>> PostTreatment(Treatment treatment)
        {
            if (TreatmentExists(treatment.Id))
            {
                return Conflict("That treatment already exists");
            }
            _repository.Insert(treatment);
            _repository.Save();

            return Created("", treatment);
        }

        // DELETE: api/Treatments/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Treatment>> DeleteTreatment(decimal id)
        {
            var treatment = _repository.GetByID(id);
            if (treatment == null)
            {
                return NotFound();
            }

            _repository.Delete(treatment);
            _repository.Save();

            return treatment;
        }

        private bool TreatmentExists(decimal id)
        {
            return _repository.Exists(id);
        }
    }
}
