using System;
using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace Lekarzowo.Controllers
{
    [Authorize(Roles = "patient,doctor,admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class MedicinehistoriesController : BaseController
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

        [HttpGet("[action]")]
        public ActionResult<IEnumerable<Medicinehistory>> ByIllnessId(decimal IllnessHistoryId)
        {
            var list = _repository.GetAll(IllnessHistoryId).ToList();
            if (list.Count == 0)
            {
                return NotFound();
            }
            return list;
        }

        // GET: api/Medicinehistories/1/1
        [HttpGet]
        public ActionResult<Medicinehistory> GetMedicinehistory(decimal IllnessHistoryId, decimal MedicineId, DateTime startDate)
        {
            var medicinehistory = _repository.GetById(IllnessHistoryId, MedicineId, startDate);

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
        [Authorize(Roles = "admin,doctor")]
        [HttpPut]
        public IActionResult PutMedicinehistory(decimal IllnessHistoryId, decimal MedicineId, DateTime startDate, Medicinehistory medicinehistory)
        {
            if (MedicineId != medicinehistory.MedicineId || IllnessHistoryId != medicinehistory.IllnesshistoryId || medicinehistory.Startdate != startDate)
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
                throw;
            }

            return NoContent();
        }

        // POST: api/Medicinehistories
        [Authorize(Roles = "admin,doctor")]
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
                throw;
            }

            return Created("", medicinehistory);
        }

        /// <summary>
        /// TODO: Dodać startdate 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        // DELETE: api/Medicinehistories/5
        [Authorize(Roles = "admin,doctor")]
        [HttpDelete]
        public ActionResult<Medicinehistory> DeleteMedicinehistory(decimal illnessHistoryId, decimal medicineId, DateTime startDate)
        {
            var medicinehistory = _repository.GetById(illnessHistoryId, medicineId, startDate);
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
