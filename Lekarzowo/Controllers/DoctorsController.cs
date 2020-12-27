﻿using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories;
using Lekarzowo.Repositories;
using Lekarzowo.Validators.UserValidators;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Transactions;
using Oracle.ManagedDataAccess.Client;

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
        public async Task<ActionResult<IEnumerable<object>>> AllByName(string name, int? limit, int? skip)
        {
            return Ok(await _repository.GetAllByNameOrLastname(name, limit, skip));
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
                return StatusCode(500, new JsonResult(e.Message));
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
                return StatusCode(500, new JsonResult(e.Message));
            }
            return Created("", doctor);
        }

        // POST: api/Patients/PostPersonAsDoctor
        [Authorize(Roles = "admin")]
        [HttpPost("[action]")]
        public async Task<ActionResult<Patient>> PostPersonAsDoctor(PersonAsDoctorRegistrationDTO person)
        {
            Person addedUser;
            using (var transaction = new TransactionScope())
            {
                if (!(_peopleController.RegisterUser(person) is CreatedResult result))
                {
                    return BadRequest();
                }

                addedUser = _peopleRepository.GetByEmail(person.Email);
                Doctor doctor = new Doctor() { Id = addedUser.Id, SpecialityId = person.SpecialityId };

                _repository.Insert(doctor);
                _repository.Save();

                transaction.Complete();
            }
            addedUser.Doctor = await _repository.GetByIdWithSpecialization(addedUser.Id);
            return Created("", addedUser);
        }

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

            try
            {
                _repository.Delete(doctor);
                _repository.Save();
            }
            catch (DbUpdateException e)
            {
                return StatusCode(500, new JsonResult(e.Message));
            }

            return doctor;
        }
    }
}
