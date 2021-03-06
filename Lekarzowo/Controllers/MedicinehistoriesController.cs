﻿using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using Lekarzowo.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.Controllers
{
    [Authorize(Roles = "patient,doctor,admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class MedicinehistoriesController : BaseController
    {
        private readonly IMedicinesHistoryRepository _repository;
        private readonly IVisitsRepository _visitsRepository; 
        private readonly IOldMedicinesHistoryRepository _oldMedicinesHistoryRepository;
        private readonly AuthorizationService _authorizationService;

        public MedicinehistoriesController(IMedicinesHistoryRepository medicinesHistoryRepository, IVisitsRepository visitsRepository, IOldMedicinesHistoryRepository oldMedicinesHistoryRepository, AuthorizationService authorizationService)
        {
            _repository = medicinesHistoryRepository;
            _visitsRepository = visitsRepository;
            _oldMedicinesHistoryRepository = oldMedicinesHistoryRepository;
            _authorizationService = authorizationService;
        }

        // GET: api/Medicinehistories/All
        [Authorize(Roles = "admin")]
        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<Medicinehistory>>> All()
        {
            var list = _repository.GetAll().ToList();
            return list;
        }

        // GET: api/Medicinehistories/ByIllnessId?IllnessHistoryId=1
        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<Medicinehistory>>> ByIllnessId(decimal IllnessHistoryId)
        {
            if (!await _repository.Exists(IllnessHistoryId))
            {
                return NotFound(NotFoundEmptyJsonResult);
            }

            if (! await _authorizationService.CanUserAccessIllnessHistory(IllnessHistoryId, this))
            {
                return Unauthorized(UnauthorizedEmptyJsonResult);
            }

            var list = _repository.GetAllByIllnessHistory(IllnessHistoryId).ToList();
            return list;
        }

        // GET: api/medicinehistories?IllnessHistoryId=164&MedicineId=2&startDate=2020-12-21
        [HttpGet]
        public async Task<ActionResult<Medicinehistory>> GetMedicinehistory(decimal IllnessHistoryId, decimal MedicineId, DateTime startDate)
        {
            if (!_repository.Exists(IllnessHistoryId, MedicineId, startDate))
            {
                return NotFound(NotFoundEmptyJsonResult);
            }

            if (! await _authorizationService.CanUserAccessIllnessHistory(IllnessHistoryId, this))
            {
                return Unauthorized(UnauthorizedEmptyJsonResult);
            }

            var medicinehistory = _repository.GetById(IllnessHistoryId, MedicineId, startDate);

            if (medicinehistory == null)
            {
                return NotFound(NotFoundEmptyJsonResult);
            }

            return medicinehistory;
        }

        // GET: api/Medicinehistories/PatientHistory?patientId=1&limit=10&skip=2
        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<object>>> PatientHistory(decimal patientId, int? limit, int? skip)
        {
            if (!await _authorizationService.CanUserAccessPatientData(patientId, this))
            {
                return Unauthorized(UnauthorizedEmptyJsonResult);
            }

            List<object> patientsHistory = new List<object>();
            patientsHistory.AddRange(await _repository.GetAll(patientId));
            patientsHistory.AddRange(await _oldMedicinesHistoryRepository.GetAll(patientId));
            
            return Ok(PaginationService<object>.SplitAndLimitIEnumerable(skip, limit, patientsHistory));
        }

        // GET: api/Medicinehistories/TakenMedicines?patientId=1&limit=10&skip=2
        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<object>>> TakenMedicines(decimal patientId, int? limit, int? skip)
        {
            if (! await _authorizationService.CanUserAccessPatientData(patientId, this))
            {
                return Unauthorized(UnauthorizedEmptyJsonResult);
            }

            return Ok(await _repository.TakenMedicines(patientId, limit, skip));
        }

        // GET: api/Medicinehistories/PrescribedMedicines?visitId=1&limit=10&skip=1
        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<object>>> PrescribedMedicines(decimal visitId, int? limit, int? skip)
        {
            if (!_visitsRepository.Exists(visitId))
            {
                return  NotFound(NotFoundEmptyJsonResult);
            }

            if (! await _authorizationService.CanUserAccessVisit(visitId, this))
            {
                return Unauthorized(UnauthorizedEmptyJsonResult);
            }

            return Ok(await _repository.PrescribedMedicines(visitId, limit, skip));
        }

        // PUT: api/medicinehistories?IllnessHistoryId=164&MedicineId=2&startDate=2020-12-21
        [Authorize(Roles = "admin,doctor")]
        [HttpPut]
        public async Task<IActionResult> PutMedicinehistory(decimal IllnessHistoryId, decimal MedicineId, DateTime startDate, Medicinehistory medicinehistory)
        {
            if (MedicineId != medicinehistory.MedicineId || IllnessHistoryId != medicinehistory.IllnesshistoryId || medicinehistory.Startdate != startDate)
            {
                return BadRequest(BadRequestEmptyJsonResult);
            }

            if (!MedicinehistoryExists(medicinehistory))
            {
                return NotFound(NotFoundEmptyJsonResult);
            }

            if (!await _authorizationService.CanUserAccessIllnessHistory(IllnessHistoryId, this))
            {
                return Unauthorized(UnauthorizedEmptyJsonResult);
            }

            try
            {
                _repository.Update(medicinehistory);
                _repository.Save();
            }
            catch (DbUpdateConcurrencyException e)
            {
                return StatusCode(500, InternalServerErrorJsonResult(e.Message));
            }

            return Ok(OkEmptyJsonResult);
        }

        // PUT: api/medicinehistories/UpdateFinishDate?illnessHistoryId=164&medicineId=2&startDate=2020-12-21&finishDate=2020-12-21
        [Authorize(Roles = "admin,doctor")]
        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateFinishDate(decimal illnessHistoryId, decimal medicineId, DateTime startDate, DateTime finishDate)
        {
            var medicineHistory = _repository.GetById(illnessHistoryId, medicineId, startDate); 

            if (medicineHistory == null)
            {
                return NotFound(NotFoundEmptyJsonResult);
            }

            if (medicineHistory.Startdate > medicineHistory.Finishdate)
            {
                return BadRequest(BadRequestJsonResult("FinishDate cannot be earlier than startDate."));
            }
            if (!await _authorizationService.CanUserAccessIllnessHistory(illnessHistoryId, this))
            {
                return Unauthorized(UnauthorizedEmptyJsonResult);
            }

            medicineHistory.Finishdate = finishDate;
            try
            {
                _repository.Update(medicineHistory);
                _repository.Save();
            }
            catch (DbUpdateConcurrencyException e)
            {
                return StatusCode(500, InternalServerErrorJsonResult(e.Message));
            }

            return Ok(OkEmptyJsonResult);
        }

        // POST: api/Medicinehistories
        [Authorize(Roles = "admin,doctor")]
        [HttpPost]
        public async Task<ActionResult<Medicinehistory>> PostMedicinehistory(Medicinehistory medicinehistory)
        {
            if (MedicinehistoryExists(medicinehistory))
            {
                return Conflict(ConflictJsonResult("Identical medicine history already exists"));
            }

            if (!await _authorizationService.CanUserAccessIllnessHistory(medicinehistory.IllnesshistoryId, this))
            {
                return Unauthorized(UnauthorizedEmptyJsonResult);
            }

            try
            {
                _repository.Insert(medicinehistory);
                _repository.Save();
            }
            catch (DbUpdateException e)
            {

                return StatusCode(500, InternalServerErrorJsonResult(e.Message));
            }

            return Created("", medicinehistory);
        }

        // DELETE: api/medicinehistories?IllnessHistoryId=164&MedicineId=2&startDate=2020-12-21
        [Authorize(Roles = "admin,doctor")]
        [HttpDelete]
        public async Task<ActionResult<Medicinehistory>> DeleteMedicinehistory(decimal illnessHistoryId, decimal medicineId, DateTime startDate)
        {
            var medicinehistory = _repository.GetById(illnessHistoryId, medicineId, startDate);
            if (medicinehistory == null)
            {
                return NotFound(NotFoundEmptyJsonResult);
            }
            if (!await _authorizationService.CanUserAccessIllnessHistory(illnessHistoryId, this))
            {
                return Unauthorized(UnauthorizedEmptyJsonResult);
            }

            try
            {
                _repository.Delete(medicinehistory);
                _repository.Save();
            }
            catch (DbUpdateException e)
            {
                return StatusCode(500, InternalServerErrorJsonResult(e.Message));
            }

            return medicinehistory;
        }

        private bool MedicinehistoryExists(Medicinehistory medHist)
        {
            return _repository.Exists(medHist.IllnesshistoryId, medHist.MedicineId, medHist.Startdate);
        }

    }
}
