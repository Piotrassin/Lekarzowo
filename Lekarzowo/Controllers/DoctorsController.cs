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

        // GET: api/doctors/all?limit=30&skip=0
        [Authorize(Roles = "admin")]
        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<Doctor>>> All(int? limit, int? skip)
        {
            return Ok(await _repository.GetAllWithPersonAndSpecializationData(limit, skip));
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
        public async Task<ActionResult<Doctor>> Single(decimal id)
        {
            var doctor = await _repository.GetByIdWithSpecialization(id);

            if (doctor == null)
            {
                return NotFound(NotFoundEmptyJsonResult);
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
                return NotFound(NotFoundEmptyJsonResult);
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
                return BadRequest(BadRequestEmptyJsonResult);
            }
            if (!_repository.Exists(doctor.Id))
            {
                return NotFound(NotFoundEmptyJsonResult);
            }

            try
            {
                _repository.Update(doctor); 
                _repository.Save();
            }
            catch (DbUpdateConcurrencyException e)
            {
                return StatusCode(500, InternalServerErrorJsonResult(e.Message));
            }
            return Ok(OkEmptyJsonResult);

        }

        // POST: api/Doctors
        [Authorize(Roles = "admin")]
        [HttpPost]
        public ActionResult PostDoctor(Doctor doctor)
        {
            if (_repository.Exists(doctor.Id))
            {
                return Conflict();
            }

            try
            {
                _repository.Insert(doctor);
                _repository.Save();
            }
            catch (DbUpdateException e)
            {
                return StatusCode(500, InternalServerErrorJsonResult(e.Message));
            }
            return Created("", doctor);
        }

        //TODO przetestować
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
                    return BadRequest(BadRequestEmptyJsonResult);
                }

                addedUser = _peopleRepository.GetByEmail(person.Email);
                Doctor doctor = new Doctor() { Id = addedUser.Id, SpecialityId = person.SpecialityId };

                if (!(PostDoctor(doctor) is CreatedResult resultDoctor))
                {
                    return BadRequest(BadRequestEmptyJsonResult);
                }

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
                return NotFound(NotFoundEmptyJsonResult);
            }

            try
            {
                _repository.Delete(doctor);
                _repository.Save();
            }
            catch (DbUpdateException e)
            {
                return StatusCode(500, InternalServerErrorJsonResult(e.Message));
            }

            return doctor;
        }
    }
}
