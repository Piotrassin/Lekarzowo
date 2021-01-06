using System;
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
    public class TreatmentsController : BaseController
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
                return NotFound(NotFoundEmptyJsonResult);
            }

            return treatment;
        }

        // PUT: api/Treatments/5
        [Authorize(Roles = "admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTreatment(decimal id, Treatment treatment)
        {
            if (id != treatment.Id)
            {
                return BadRequest(BadRequestEmptyJsonResult);
            }
            if (!TreatmentExists(id))
            {
                return NotFound(NotFoundEmptyJsonResult);
            }

            try
            {
                _repository.Update(treatment);
                _repository.Save();
            }
            catch (DbUpdateConcurrencyException e)
            {
                return StatusCode(500, InternalServerErrorJsonResult(e.Message));
            }

            return Ok(OkEmptyJsonResult);
        }

        // POST: api/Treatments
        [Authorize(Roles = "admin")]
        [HttpPost]
        public async Task<ActionResult<Treatment>> PostTreatment(Treatment treatment)
        {
            if (_repository.Exists(treatment.Name))
            {
                return Conflict(ConflictJsonResult("Treatment with that name already exists"));
            }

            treatment.Id = Decimal.Zero;
            try
            {
                _repository.Insert(treatment);
                _repository.Save();
            }
            catch (DbUpdateConcurrencyException e)
            {
                return StatusCode(500, InternalServerErrorJsonResult(e.Message));
            }

            return Created("", treatment);
        }

        // DELETE: api/Treatments/5
        [Authorize(Roles = "admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult<Treatment>> DeleteTreatment(decimal id)
        {
            var treatment = _repository.GetByID(id);
            if (treatment == null)
            {
                return NotFound(NotFoundEmptyJsonResult);
            }

            try
            {
                _repository.Delete(treatment);
                _repository.Save();
            }
            catch (DbUpdateException e)
            {
                return StatusCode(500, InternalServerErrorJsonResult(e.Message));
            }

            return treatment;
        }

        private bool TreatmentExists(decimal id)
        {
            return _repository.Exists(id);
        }
    }
}
