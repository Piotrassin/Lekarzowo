using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Lekarzowo.DataAccessLayer.Repositories;
using Lekarzowo.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Lekarzowo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IllnessesController : ControllerBase
    {
        private readonly IIllnessesRepository _repository;

        public IllnessesController(IIllnessesRepository repository)
        {
            _repository = repository;
        }

        // GET: api/Illnesses
        [HttpGet]
        public ActionResult<IEnumerable<Illness>> GetIllnesses()
        {
            return _repository.GetAll().ToList();
        }

        // GET: api/Illnesses?Name=abc
        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<Illness>>> ListByName(string Name)
        {
            return Ok(await _repository.GetAllByName(Name));
        }

        // GET: api/Illnesses/5
        [HttpGet("{id}")]
        public ActionResult<Illness> GetIllness(decimal id)
        {
            var illness = _repository.GetByID(id);

            if (illness == null)
            {
                return NotFound();
            }

            return illness;
        }

        // PUT: api/Illnesses/5
        [HttpPut("{id}")]
        public IActionResult PutIllness(decimal id, Illness illness)
        {
            if (id != illness.Id)
            {
                return BadRequest();
            }

            if (_repository.GetByID(illness.Id) != null)
            {
                _repository.Update(illness);
            }

            try
            {
                _repository.Save();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!IllnessExists(id))
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

        // POST: api/Illnesses
        [HttpPost]
        public ActionResult<Doctor> PostIllness(Illness illness)
        {
            #region wygenerowane przez EF core. Przydatne?
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
            #endregion

            if (_repository.Exists(illness))
            {
                return Conflict("That illness already exists");
            }
            _repository.Insert(illness);
            _repository.Save();

            return Created("", illness);
        }

        // DELETE: api/Illnesses/5
        [HttpDelete("{id}")]
        public ActionResult<Illness> DeleteIllness(decimal id)
        {
            var illness = _repository.GetByID(id);
            if (illness == null)
            {
                return NotFound();
            }

            _repository.Delete(illness);
            _repository.Save();

            return illness;
        }

        private bool IllnessExists(decimal id)
        {
            return _repository.Exists(id);
        }
    }
}