using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.Models;
using Lekarzowo.DataAccessLayer.Repositories;

namespace Lekarzowo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MedicinesController : ControllerBase
    {
        private readonly IMedicinesRepository _repository;

        public MedicinesController(IMedicinesRepository repository)
        {
            _repository = repository;
        }

        // GET: api/Medicines
        [HttpGet]
        public ActionResult<IEnumerable<Medicine>> GetMedicine()
        {
            return _repository.GetAll().ToList();
            //return await _repository.Medicine.ToListAsync();
        }

        // GET: api/Medicines/5
        [HttpGet("{id}")]
        public ActionResult<Medicine> GetMedicine(decimal id)
        {
            var medicine = _repository.GetByID(id);

            if (medicine == null)
            {
                return NotFound();
            }

            return medicine;
        }

        // PUT: api/Medicines/5
        [HttpPut("{id}")]
        public IActionResult PutMedicine(decimal id, Medicine medicine)
        {
            if (id != medicine.Id)
            {
                return BadRequest();
            }

            if (_repository.GetByID(medicine.Id) != null)
            {
                _repository.Update(medicine);
            } 

            try
            {
                _repository.Save();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MedicineExists(id))
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

        // POST: api/Medicines
        [HttpPost]
        public async Task<ActionResult<Medicine>> PostMedicine(Medicine medicine)
        {
            _repository.Insert(medicine);
            _repository.Save();

            return CreatedAtAction("GetMedicine", new { id = medicine.Id }, medicine);
        }

        // DELETE: api/Medicines/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Medicine>> DeleteMedicine(decimal id)
        {
            var medicine = _repository.GetByID(id);
            if (medicine == null)
            {
                return NotFound();
            }

            _repository.Delete(medicine);
            _repository.Save();

            return medicine;
        }

        private bool MedicineExists(decimal id)
        {
            return _repository.Exists(id);
        }
    }
}
