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

        /// <summary>
        /// TODO: GetAllAdditional powinna zwracać wszystkie historie przyjmowanego leku przez danego pacjenta. Wszystkie leki gdzie Idpacjenta = IllnessHistory.PatientId mniej więcej.
        /// </summary>
        /// <param name="IllnessHistoryId"></param>
        /// <returns></returns>
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
        /// TODO: Parametry powinny być przekazywane wewnątrz ciała, a nie w URI?
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        // GET: api/Medicinehistories/1/1
        [HttpGet("{IllnessHistoryId}/{MedicineId}")]
        public ActionResult<Medicinehistory> GetMedicinehistory(decimal IllnessHistoryId, decimal MedicineId)
        {
            var medicinehistory = _repository.GetByID(IllnessHistoryId, MedicineId);

            if (medicinehistory == null)
            {
                return NotFound();
            }

            return medicinehistory;
        }

        // GET: api/Medicinehistories/TakenMedicines?patientId=1&limit=10&skip=2
        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<object>>> TakenMedicines(decimal patientId, int? limit, int? skip)
        {
            return Ok(await _repository.TakenMedicines(patientId, limit, skip));
        }

        // GET: api/Medicinehistories/PrescribedMedicines?visitId=1&limit=10&skip=1
        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<object>>> PrescribedMedicines(decimal visitId, int? limit, int? skip)
        {
            return Ok(await _repository.PrescribedMedicines(visitId, limit, skip));
        }

        // PUT: api/Medicinehistories/5
        [HttpPut("{IllnessHistoryId}/{MedicineId}")]
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
        /// TODO: Parametry powinny być przekazywane wewnątrz ciała, a nie w URI?
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        // DELETE: api/Medicinehistories/5
        [HttpDelete("{IllnessHistoryId}/{MedicineId}")]
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
