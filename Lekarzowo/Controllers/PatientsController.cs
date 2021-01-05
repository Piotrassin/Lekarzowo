using Lekarzowo.DataAccessLayer.DTO;
using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using Lekarzowo.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Transactions;

namespace Lekarzowo.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PatientsController : BaseController
    {
        private readonly IPatientsRepository _repository; 
        private readonly IPeopleRepository _peopleRepository;
        private readonly PeopleController _peopleController;

        public PatientsController(IPatientsRepository repository, PeopleController peopleController, IPeopleRepository peopleRepository)
        {
            _repository = repository;
            _peopleController = peopleController;
            _peopleRepository = peopleRepository;
        }

        // GET: api/Patients
        [Authorize(Roles = "admin")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Patient>>> GetPatient()
        {
            return Ok( _repository.GetAll());
        }

        // GET: api/Patients/5
        [Authorize(Roles = "patient,admin")]
        [HttpGet("{id}")]
        public async Task<ActionResult<Patient>> GetPatient(decimal id)
        {
            if (UserIsPatientAndDoesntHaveAccess(id)) return Unauthorized();

            var patient = _repository.GetByID(id);
            if (patient == null) return NotFound();

            return patient;
        }

        // PUT: api/Patients/5
        [Authorize(Roles = "patient,admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPatient(decimal id, Patient patient)
        {
            if (id != patient.Id) return BadRequest();
            if (UserIsPatientAndDoesntHaveAccess(id)) return Unauthorized();
            if (!PatientExists(id)) return NotFound();

            try
            {
                _repository.Update(patient);
                _repository.Save();
            }
            catch (DbUpdateConcurrencyException e)
            {
                return StatusCode(500, new JsonResult(e.Message));
            }

            return NoContent();
        }

        // POST: api/Patients
        [Authorize(Roles = "admin")]
        [HttpPost]
        public async Task<ActionResult> PostPatient(Patient patient)
        {
            if (PatientExists(patient.Id))
            {
                return Conflict(new JsonResult("This person already is a patient"));
            }

            try
            {
                _repository.Insert(patient);
                _repository.Save();
            }
            catch (DbUpdateException e)
            {
                return StatusCode(500, new JsonResult(e.Message));
            }

            return Created("", patient);
        }

        //TODO przetestować
        // POST: api/Patients/PostPersonAsPatient
        [AllowAnonymous]
        [HttpPost("[action]")]
        public async Task<ActionResult<Patient>> PostPersonAsPatient(PersonRegistrationDTO person)
        {
            using (var transaction = new TransactionScope())
            {
                if (!(_peopleController.RegisterUser(person) is CreatedResult result))
                {
                    return BadRequest();
                }

                Person user = _peopleRepository.GetByEmail(person.Email);
                Patient newPatient = new Patient() { Id = user.Id, IdNavigation = user };


                if (!(await PostPatient(newPatient) is CreatedResult resultDoctor))
                {
                    return BadRequest();
                }
                //_repository.Insert(newPatient);
                //_repository.Save();

                transaction.Complete();

                user.Patient = newPatient;
                return Created("", user);
            }
        }

        // DELETE: api/Patients/5
        [Authorize(Roles = "patient,admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult<Patient>> DeletePatient(decimal id)
        {
            if (UserIsPatientAndDoesntHaveAccess(id)) return Unauthorized();

            var patient = _repository.GetByID(id);
            if (patient == null) return NotFound();

            try
            {
                _repository.Delete(patient);
                _repository.Save();
            }
            catch (DbUpdateException e)
            {
                return StatusCode(500, new JsonResult(e.Message));
            }

            return patient;
        }

        private bool PatientExists(decimal id)
        {
            return _repository.Exists(id);
        }

    }
}
