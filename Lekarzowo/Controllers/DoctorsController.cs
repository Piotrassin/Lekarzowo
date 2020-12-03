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
using Microsoft.AspNetCore.Authorization;

namespace Lekarzowo.Controllers
{
    //[Authorize(Roles = "admin,doctor")]
    [Route("api/[controller]")]
    [ApiController]
    public class DoctorsController : BaseController
    {
        private readonly IDoctorsRepository _repository;

        public DoctorsController(IDoctorsRepository repository)
        {
            _repository = repository;
        }

        // GET: api/Doctors
        [HttpGet("[action]")]
        public ActionResult<IEnumerable<Doctor>> All()
        {
            return _repository.GetAll().ToList();
        }

        // GET: api/Doctors/AllByName?Name=abc&limit=0&skip=0
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
            //return doctor;
        }

        // PUT: api/Doctors/5
        [HttpPut]
        public IActionResult PutDoctor(Doctor doctor)
        {
            var id = GetUserIdFromToken();
            if (id != doctor.Id)
            {
                return BadRequest();
            }

            if (_repository.GetByID(doctor.Id) != null)
            {
                _repository.Update(doctor);
            }

            try
            {
                _repository.Save();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DoctorExists(id))
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

        // POST: api/Doctors
        [HttpPost]
        public ActionResult<Doctor> PostDoctor(Doctor doctor)
        {
            //_context.Doctor.Add(doctor);
            //try
            //{
            //    await _context.SaveChangesAsync();
            //}
            //catch (DbUpdateException)
            //{
            //    if (DoctorExists(doctor.Id))
            //    {
            //        return Conflict();
            //    }
            //    else
            //    {
            //        throw;
            //    }
            //}

            //return CreatedAtAction("GetDoctor", new { id = doctor.Id }, doctor);

            
            if (_repository.Exists(doctor))
            {
                return Conflict("That doctor already exists");
            }
            _repository.Insert(doctor);
            _repository.Save();

            return Created("", doctor);
        }

        // DELETE: api/Doctors/5
        [HttpDelete]
        public ActionResult<Doctor> DeleteDoctor()
        {
            var id = GetUserIdFromToken();
            var doctor = _repository.GetByID(id);
            if (doctor == null)
            {
                return NotFound();
            }

            _repository.Delete(doctor);
            _repository.Save();

            return doctor;
        }

        private bool DoctorExists(decimal id)
        {
            return _repository.Exists(id);
        }
    }
}
