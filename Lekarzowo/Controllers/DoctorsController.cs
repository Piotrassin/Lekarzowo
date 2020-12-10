using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Lekarzowo.Models;
using Lekarzowo.DataAccessLayer.Repositories;
using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.Repositories;
using Microsoft.AspNetCore.Authorization;

namespace Lekarzowo.Controllers
{
    [Authorize(Roles = "admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class DoctorsController : BaseController
    {
        private readonly IDoctorsRepository _repository;
        private readonly IPeopleRepository _peopleRepository;

        public DoctorsController(IDoctorsRepository repository, IPeopleRepository pepRepo)
        {
            _repository = repository;
            _peopleRepository = pepRepo;
        }

        // GET: api/Doctors
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

        // PUT: api/Doctors/5
        [HttpPut]
        public IActionResult PutDoctor(Doctor doctor)
        {
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
        [HttpPost]
        public ActionResult<Doctor> PostDoctor(Doctor doctor)
        {
            try
            {
                if (!_peopleRepository.Exists(doctor.Id)) return BadRequest("Person doesn't exist");
                if (_repository.Exists(doctor.Id)) return BadRequest(("That doctor already exists"));

                _repository.Insert(doctor);
                _repository.Save();
                return Created("", doctor);
            }
            catch (DbUpdateException e)
            {
                return StatusCode(500, e.Message);
            }
        }

        // DELETE: api/Doctors/5
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
