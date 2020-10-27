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
    public class PatientsController : ControllerBase
    {
        private readonly IPatientsRepository _repository;

        public PatientsController(IPatientsRepository repository)
        {
            _repository = repository;
        }

        // GET: api/Patients
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Patient>>> GetPatient()
        {
            return Ok( _repository.GetAll());
        }

        // GET: api/Patients/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Patient>> GetPatient(decimal id)
        {
            var patient = _repository.GetByID(id);

            if (patient == null)
            {
                return NotFound();
            }

            return patient;
        }

        // PUT: api/Patients/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPatient(decimal id, Patient patient)
        {
            if (id != patient.Id)
            {
                return BadRequest();
            }

            if (_repository.GetByID(patient.Id) != null)
            {
                _repository.Update(patient);
            }

            try
            {
                _repository.Save();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PatientExists(id))
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

        // POST: api/Patients
        [HttpPost]
        public async Task<ActionResult<Patient>> PostPatient(Patient patient)
        {
            if (PatientExists(patient.Id))
            {
                return Conflict("That patient already exists");
            }
            _repository.Insert(patient);
            _repository.Save();

            return Created("", patient);
        }

        // DELETE: api/Patients/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Patient>> DeletePatient(decimal id)
        {
            var patient = _repository.GetByID(id);
            if (patient == null)
            {
                return NotFound();
            }

            _repository.Delete(patient);
            _repository.Save();

            return patient;
        }

        private bool PatientExists(decimal id)
        {
            return _repository.Exists(id);
        }
    }
}
