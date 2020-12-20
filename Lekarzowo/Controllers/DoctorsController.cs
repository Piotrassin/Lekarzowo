using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories;
using Lekarzowo.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DoctorsController : BaseController
    {
        private readonly IDoctorsRepository _repository;
        private readonly IPeopleRepository _peopleRepository;
        private readonly PeopleController _peopleController;

        public DoctorsController(IDoctorsRepository repository, PeopleController peopleController, IPeopleRepository peopleRepository)
        {
            _repository = repository;
            _peopleController = peopleController;
            _peopleRepository = peopleRepository;
        }

        // GET: api/Doctors
        [Authorize(Roles = "admin")]
        [HttpGet("[action]")]
        public ActionResult<IEnumerable<Doctor>> All()
        {
            return _repository.GetAll().ToList();
        }

        // GET: api/Doctors/AllByName?Name=abc&limit=0&skip=0
        [AllowAnonymous]
        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<object>>> AllByName(string name, int? skip, int? limit)
        {
            return Ok(await _repository.GetAllByNameOrLastname(name, skip, limit));
        }

        // GET: api/Doctors/5
        [AllowAnonymous]
        [HttpGet("{id}")]
        public ActionResult<Doctor> Single(decimal id)
        {
            var doctor = _repository.GetByID(id);

            if (doctor == null)
            {
                return NotFound();
            }

            return doctor;
        }

        // GET: api/Doctors/ContactData/5
        [AllowAnonymous]
        [HttpGet("[action]/{id}")]
        public async Task<ActionResult<object>> ContactData(decimal id)
        {
            var doctor = _repository.DoctorsContactData(id);

            if (doctor == null)
            {
                return NotFound();
            }

            return doctor;
        }

        // PUT: api/Doctors/5
        [Authorize(Roles = "admin")]
        [HttpPut("{id}")]
        public IActionResult PutDoctor(decimal id, Doctor doctor)
        {
            if (id != doctor.Id)
            {
                return BadRequest();
            }
            try
            {
                if (_repository.Exists(doctor.Id))
                {
                    _repository.Update(doctor); 
                    _repository.Save();
                    return Ok();
                }
                return NotFound();
            }
            catch (DbUpdateConcurrencyException e)
            {
                return StatusCode(500, e.Message);
            }
        }

        // POST: api/Doctors
        [Authorize(Roles = "admin")]
        [HttpPost]
        public ActionResult<Doctor> PostDoctor(Doctor doctor)
        {
            try
            {
                _repository.Insert(doctor);
                _repository.Save();
            }
            catch (DbUpdateException e)
            {
                return StatusCode(500, e.Message);
            }
            return Created("", doctor);
        }

        //TODO:
        //// POST: api/Patients/PostPersonAsPatient
        //[AllowAnonymous]
        //[HttpPost("[action]")]
        //public async Task<ActionResult<Patient>> PostPersonAsDoctor(UserRegistrationDTO person)
        //{
        //    using (var transaction = new TransactionScope())
        //    {
        //        if (!(_peopleController.RegisterUser(person) is CreatedResult result))
        //        {
        //            return BadRequest();
        //        }

        //        Person user = _peopleRepository.GetByEmail(person.Email);
        //        Doctor doctor = new Doctor() { Id = user.Id, IdNavigation = user };

        //        _repository.Insert(doctor);
        //        _repository.Save();

        //        transaction.Complete();

        //        user.Doctor = doctor;
        //        return Created("", user);
        //    }
        //}

        // DELETE: api/Doctors/5
        [Authorize(Roles = "admin")]
        [HttpDelete("{doctorId}")]
        public ActionResult<Doctor> DeleteDoctor(decimal doctorId)
        {
            var doctor = _repository.GetByID(doctorId);
            if (doctor == null)
            {
                return NotFound();
            }

            _repository.Delete(doctor);
            _repository.Save();

            return doctor;
        }
    }
}
