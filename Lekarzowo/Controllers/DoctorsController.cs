﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Lekarzowo.Models;
using Lekarzowo.DataAccessLayer.Repositories;

namespace Lekarzowo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DoctorsController : ControllerBase
    {
        private readonly IDoctorsRepository _repository;

        public DoctorsController(IDoctorsRepository repository)
        {
            _repository = repository;
        }

        // GET: api/Doctors
        [HttpGet]
        public ActionResult<IEnumerable<Doctor>> GetDoctors()
        {
            return _repository.GetAll().ToList();
        }

        // GET: api/Doctors/5
        [HttpGet("{id}")]
        public ActionResult<Doctor> GetDoctor(decimal id)
        {
            var doctor = _repository.GetByID(id);

            if (doctor == null)
            {
                return NotFound();
            }

            return doctor;
        }

        // PUT: api/Doctors/5
        [HttpPut("{id}")]
        public IActionResult PutDoctor(decimal id, Doctor doctor)
        {
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
        /// <summary>
        /// TODO: Poprawić metodę exists(Doctor) albo exists(name) żeby sprawdzała czy dany obiekt Person istnieje zamiast Doctor
        /// </summary>
        /// <param name="doctor"></param>
        /// <returns></returns>
        // POST: api/Doctors
        [HttpPost]
        public async Task<ActionResult<Doctor>> PostDoctor(Doctor doctor)
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
        [HttpDelete("{id}")]
        public ActionResult<Doctor> DeleteDoctor(decimal id)
        {
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
