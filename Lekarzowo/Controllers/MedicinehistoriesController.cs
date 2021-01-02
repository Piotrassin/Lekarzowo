using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Lekarzowo.DataAccessLayer.Repositories;

namespace Lekarzowo.Controllers
{
    [Authorize(Roles = "patient,doctor,admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class MedicinehistoriesController : BaseController
    {
        private readonly IMedicinesHistoryRepository _repository;
        private readonly IVisitsRepository _visitsRepository;
        private readonly IIllnessesHistoryRepository _illnessesHistoryRepository;
        private readonly VisitsController _visitsController;


        public MedicinehistoriesController(IMedicinesHistoryRepository medicinesHistoryRepository, IIllnessesHistoryRepository illnessesHistoryRepository, 
            IVisitsRepository visitsRepository, VisitsController visitsController)
        {
            _repository = medicinesHistoryRepository;
            _visitsRepository = visitsRepository;
            _illnessesHistoryRepository = illnessesHistoryRepository;
            _visitsController = visitsController;
        }

        /// <summary>
        /// TODO: GetAllAdditional powinna zwracać wszystkie historie przyjmowanego leku przez danego pacjenta. Wszystkie leki gdzie Idpacjenta = IllnessHistory.PatientId mniej więcej.
        /// </summary>
        /// <param name="IllnessHistoryId"></param>
        /// <returns></returns>
        // GET: api/Medicinehistories/ByIllnessId?IllnessHistoryId=1

        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<Medicinehistory>>> ByIllnessId(decimal IllnessHistoryId)
        {
            if (!await _repository.Exists(IllnessHistoryId))
            {
                return NotFound();
            }

            if (!await IsOwnedByPatientIllnessHistory(IllnessHistoryId))
            {
                return Unauthorized();
            }

            var list = _repository.GetAll(IllnessHistoryId).ToList();
            return list;
        }

        // GET: api/medicinehistories?IllnessHistoryId=164&MedicineId=2&startDate=2020-12-21
        [HttpGet]
        public async Task<ActionResult<Medicinehistory>> GetMedicinehistory(decimal IllnessHistoryId, decimal MedicineId, DateTime startDate)
        {
            if (!_repository.Exists(IllnessHistoryId, MedicineId, startDate))
            {
                return NotFound();
            }

            if (!await IsOwnedByPatientIllnessHistory(IllnessHistoryId))
            {
                return Unauthorized();
            }

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
            if (UserIsPatientAndDoesntHaveAccess(patientId))
            {
                return Unauthorized();
            }

            return Ok(await _repository.TakenMedicines(patientId, limit, skip));
        }

        // GET: api/Medicinehistories/PrescribedMedicines?visitId=1&limit=10&skip=1
        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<object>>> PrescribedMedicines(decimal visitId, int? limit, int? skip)
        {
            if (!_visitsRepository.Exists(visitId))
            {
                return  NotFound();
            }

            if (await _visitsController.IsOwnedByPatientVisit(visitId))
            {
                return Unauthorized();
            }

            return Ok(await _repository.PrescribedMedicines(visitId, limit, skip));
        }

        // PUT: api/medicinehistories?IllnessHistoryId=164&MedicineId=2&startDate=2020-12-21
        [Authorize(Roles = "admin,doctor")]
        [HttpPut]
        public IActionResult PutMedicinehistory(decimal IllnessHistoryId, decimal MedicineId, DateTime startDate, Medicinehistory medicinehistory)
        {
            if (MedicineId != medicinehistory.MedicineId || IllnessHistoryId != medicinehistory.IllnesshistoryId || medicinehistory.Startdate != startDate)
            {
                return BadRequest();
            }

            if (!MedicinehistoryExists(medicinehistory))
            {
                return NotFound();
            }

            try
            {
                _repository.Update(medicinehistory);
                _repository.Save();
            }
            catch (DbUpdateConcurrencyException e)
            {
                return StatusCode(500, new JsonResult(e.Message));
            }

            return NoContent();
        }

        // POST: api/Medicinehistories
        [Authorize(Roles = "admin,doctor")]
        [HttpPost]
        public ActionResult<Medicinehistory> PostMedicinehistory(Medicinehistory medicinehistory)
        {
            if (MedicinehistoryExists(medicinehistory))
            {
                return Conflict(new JsonResult("Identical medicine history already exists"));
            }

            try
            {
                _repository.Insert(medicinehistory);
                _repository.Save();
            }
            catch (DbUpdateException e)
            {

                return StatusCode(500, new JsonResult(e.Message));
            }

            return Created("", medicinehistory);
        }

        // DELETE: api/medicinehistories?IllnessHistoryId=164&MedicineId=2&startDate=2020-12-21
        [Authorize(Roles = "admin,doctor")]
        [HttpDelete]
        public ActionResult<Medicinehistory> DeleteMedicinehistory(decimal illnessHistoryId, decimal medicineId, DateTime startDate)
        {
            var medicinehistory = _repository.GetById(illnessHistoryId, medicineId, startDate);
            if (medicinehistory == null)
            {
                return NotFound();
            }

            try
            {
                _repository.Delete(medicinehistory);
                _repository.Save();
            }
            catch (DbUpdateException e)
            {
                return StatusCode(500, new JsonResult(e.Message));
            }

            return medicinehistory;
        }

        private bool MedicinehistoryExists(Medicinehistory medHist)
        {
            return _repository.Exists(medHist.IllnesshistoryId, medHist.MedicineId, medHist.Startdate);
        }

        private async Task<bool> IsOwnedByPatientIllnessHistory(decimal illnessHistoryId)
        {
            var illnessHistory = await _illnessesHistoryRepository.GetOwner(illnessHistoryId);

            if (UserIsPatientAndDoesntHaveAccess(illnessHistory.Visit.Reservation.PatientId))
            {
                return false;
            }

            return true;
        }
    }
}
