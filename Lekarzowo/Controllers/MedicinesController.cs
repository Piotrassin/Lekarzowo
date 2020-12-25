using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Oracle.ManagedDataAccess.Client;

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
        }

        // GET: api/Medicines/AllByName?Name=abc&limit=0&skip=0
        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<Medicine>>> AllByName(string name, int? limit, int? skip)
        {
            return Ok(await _repository.GetAllByName(name, limit, skip));
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

            if (!MedicineExists(medicine.Id))
            {
                return NotFound();
            } 

            try
            {
                _repository.Update(medicine);
                _repository.Save();
            }
            catch (DbUpdateConcurrencyException e)
            {
                return StatusCode(500, new JsonResult(e.Message));
            }

            return NoContent();
        }

        // POST: api/Medicines
        [HttpPost]
        public async Task<ActionResult<Medicine>> PostMedicine(Medicine medicine)
        {
            _repository.Insert(medicine);
            _repository.Save();

            return Created("", medicine);
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

            try
            {
                _repository.Delete(medicine);
                _repository.Save();
            }
            catch (DbUpdateException e)
            {
                return StatusCode(500, new JsonResult(e.Message));
            }

            return medicine;
        }

        private bool MedicineExists(decimal id)
        {
            return _repository.Exists(id);
        }
    }
}
