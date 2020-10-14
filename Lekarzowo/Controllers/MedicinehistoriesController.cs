using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;

namespace Lekarzowo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MedicinehistoriesController : ControllerBase
    {
        private readonly IMedicinesHistoryRepository _repository;

        public MedicinehistoriesController(IMedicinesHistoryRepository context)
        {
            _repository = context;
        }


        // GET: api/Medicinehistories/1
        [HttpGet("{IllnessHistoryId}")]
        public ActionResult<IEnumerable<Medicinehistory>> GetMedicinehistory(decimal IllnessHistoryId)
        {
            var list = _repository.GetAll(IllnessHistoryId).ToList();
            if (list.Count == 0)
            {
                return NotFound();
            }
            return list;
        }


        /// <summary>
        /// TODO: Parametry powinny być przekazywane wewnątrz ciała, a nie w URI.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        // GET: api/Medicinehistories?IllnessHistoryId=1&MedicineId=1
        [HttpGet]
        public ActionResult<Medicinehistory> GetMedicinehistory(decimal IllnessHistoryId, decimal MedicineId)
        {
            var medicinehistory = _repository.GetByID(IllnessHistoryId, MedicineId);

            if (medicinehistory == null)
            {
                return NotFound();
            }

            return medicinehistory;
        }

        // PUT: api/Medicinehistories/5
        [HttpPut("{id}")]
        public IActionResult PutMedicinehistory(decimal IllnessHistoryId, decimal MedicineId, Medicinehistory medicinehistory)
        {
            if (MedicineId != medicinehistory.MedicineId || IllnessHistoryId != medicinehistory.IllnesshistoryId)
            {
                return BadRequest();
            }

            if (!_repository.Exists(medicinehistory.IllnesshistoryId, medicinehistory.MedicineId))
            {
                _repository.Update(medicinehistory);
            }

            try
            {
                 _repository.Save();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MedicinehistoryExists(medicinehistory))
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

        // POST: api/Medicinehistories
        [HttpPost]
        public ActionResult<Medicinehistory> PostMedicinehistory(Medicinehistory medicinehistory)
        {
            _repository.Insert(medicinehistory);
            try
            {
                _repository.Save();
            }
            catch (DbUpdateException)
            {
                if (MedicinehistoryExists(medicinehistory))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetMedicinehistory", new { id = medicinehistory.MedicineId }, medicinehistory);
        }
        /// <summary>
        /// TODO: Parametry powinny być przekazywane wewnątrz ciała, a nie w URI.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        // DELETE: api/Medicinehistories/5
        [HttpDelete("{id}")]
        public ActionResult<Medicinehistory> DeleteMedicinehistory(decimal IllnessHistoryId, decimal MedicineId)
        {
            var medicinehistory = _repository.GetByID(IllnessHistoryId, MedicineId);
            if (medicinehistory == null)
            {
                return NotFound();
            }

            _repository.Delete(medicinehistory);
            _repository.Save();

            return medicinehistory;
        }

        private bool MedicinehistoryExists(Medicinehistory medicinehistory)
        {
            return _repository.Exists(medicinehistory.IllnesshistoryId, medicinehistory.MedicineId);
        }
    }
}
