using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using Lekarzowo.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Lekarzowo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IllnesseshistoryController : BaseController
    {
        private readonly IIllnessesHistoryRepository _repository;
        private readonly IVisitsRepository _visitsRepository;
        private readonly IReservationsRepository _reservationsRepository;
        private readonly IOldIllnessesHistoryRepository _oldIllnessesHistoryRepository;
        private readonly AuthorizationService _authorizationService;


        public IllnesseshistoryController(IIllnessesHistoryRepository context, IVisitsRepository visitsRepository, 
            IOldIllnessesHistoryRepository oldIllnessesHistoryRepository, IReservationsRepository reservationsRepository, AuthorizationService authorizationService)
        {
            _repository = context;
            _visitsRepository = visitsRepository;
            _oldIllnessesHistoryRepository = oldIllnessesHistoryRepository;
            _reservationsRepository = reservationsRepository;
            _authorizationService = authorizationService;
        }

        // GET: api/Illnesseshistory
        [Authorize(Roles = "admin")]
        [HttpGet]
        public ActionResult<IEnumerable<Illnesshistory>> GetIllnesshistories()
        {
            return _repository.GetAll().ToList();
        }

        // GET: api/Illnesseshistory/Single/5
        [Authorize(Roles = "patient,doctor,admin")]
        [HttpGet("[action]/{illnessHistoryId}")]
        public async Task<ActionResult<Illnesshistory>> Single(decimal illnessHistoryId)
        {
            var illnesshistory = _repository.GetByID(illnessHistoryId);
            if(illnesshistory == null)
            {
                return NotFound(NotFoundEmptyJsonResult);
            }
            if (! await _authorizationService.CanUserAccessIllnessHistory(illnessHistoryId, this))
            {
                return Unauthorized(UnauthorizedEmptyJsonResult);
            }

            return illnesshistory;
        }

        // GET: api/Illnesseshistory/AllByPatientId
        [Authorize(Roles = "patient,doctor,admin")]
        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<object>>> AllByPatientId(decimal patientId, int? limit, int? skip)
        {
            var illnesshistoryList = _repository.GetAllWithAdditionalInfo(patientId); 
            
            if (illnesshistoryList == null)
            {
                return NotFound(NotFoundEmptyJsonResult);
            }
            if (! await _authorizationService.CanUserAccessPatientData(patientId, this))
            {
                return Unauthorized(UnauthorizedEmptyJsonResult);
            }

            var enumerableHistory = PaginationService<object>.SplitAndLimitIEnumerable(skip, limit, illnesshistoryList);

            return enumerableHistory.ToList();
        }

        // GET: api/Illnesseshistory/AllByVisitId?visitId=1&limit=10&skip=1
        [Authorize(Roles = "patient,doctor,admin")]
        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<object>>> AllByVisitId(decimal visitId, int? limit, int? skip)
        {
            if (!_visitsRepository.Exists(visitId))
            {
                return NotFound(NotFoundEmptyJsonResult);
            }
            if (! await _authorizationService.CanUserAccessVisit(visitId, this))
            {
                return Unauthorized(UnauthorizedEmptyJsonResult);
            }

            var illnesshistoryList = await _repository.AllByVisitId(visitId, limit, skip);

            return  illnesshistoryList.ToList();
        }

        // GET: api/Illnesseshistory/AllByNameOnAVisit?visitId=1&name=abc&limit=0&skip=0
        [Authorize(Roles = "patient,doctor,admin")]
        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<Illness>>> AllByNameOnAVisit(decimal visitId, string name, int? limit, int? skip)
        {
            var visit = _visitsRepository.GetByID(visitId);
            if (visit == null)
            {
                return NotFound(NotFoundEmptyJsonResult);
            }
            if (! await _authorizationService.CanUserAccessPatientData(visit.Reservation.PatientId, this))
            {
                return Unauthorized(UnauthorizedEmptyJsonResult);
            }

            return Ok(await _repository.AllByNameOnVisit(visitId, name, limit, skip));
        }

        // GET: api/Illnesseshistory/PatientHistory?patientId=1&limit=10&skip=2
        [Authorize(Roles = "patient,doctor,admin")]
        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<object>>> PatientHistory(decimal patientId, int? limit, int? skip)
        {
            if (! await _authorizationService.CanUserAccessPatientData(patientId, this))
            {
                return Unauthorized(UnauthorizedEmptyJsonResult);
            }

            var illnessHistory = await _repository.PatientHistory(patientId);
            var oldillnesshistory = await _oldIllnessesHistoryRepository.GetAllSpecificData(patientId);

            List<object> patientsHistory = new List<object>();
            patientsHistory.AddRange(illnessHistory);
            patientsHistory.AddRange(oldillnesshistory);

            IEnumerable<object> enumerableHistory = patientsHistory;
            enumerableHistory = PaginationService<object>.SplitAndLimitIEnumerable(skip, limit, enumerableHistory);

            return Ok(enumerableHistory);
        }

        // PUT: api/Illnesseshistory/5
        [Authorize(Roles = "doctor,admin")]
        [HttpPut("{illnessHistoryId}")]
        public async Task<IActionResult> PutIllnesshistory(decimal illnessHistoryId, Illnesshistory illnesshistory)
        {
            if (illnessHistoryId != illnesshistory.Id)
            {
                return BadRequest(BadRequestEmptyJsonResult);
            }

            if (!IllnesshistoryExists(illnesshistory.Id))
            {
                return NotFound(NotFoundEmptyJsonResult);
            }

            if (! await _authorizationService.CanUserAccessIllnessHistory(illnessHistoryId, this))
            {
                return Unauthorized(UnauthorizedEmptyJsonResult);
            }

            try
            {
                _repository.Update(illnesshistory);
                _repository.Save();
            }
            catch (DbUpdateConcurrencyException e)
            {
                return StatusCode(500, InternalServerErrorJsonResult(e.Message));
            }

            return Ok(OkEmptyJsonResult);
        }

        // PUT: api/illnesseshistory/updatecuredate?illnesshistoryid=1&curedate=1999-12-05
        [Authorize(Roles = "doctor,admin")]
        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateCuredate(decimal illnessHistoryId, DateTime cureDate)
        {
            var illnesshistory = _repository.GetByID(illnessHistoryId); 
            if (illnesshistory == null)
            {
                return NotFound(NotFoundEmptyJsonResult);
            }
            if (!await _authorizationService.CanUserAccessIllnessHistory(illnessHistoryId, this))
            {
                return Unauthorized(UnauthorizedEmptyJsonResult);
            }

            var reservation = await _reservationsRepository.GetByID(illnesshistory.VisitId);
            if (reservation.Starttime > cureDate)
            {
                return BadRequest(BadRequestJsonResult("CureDate cannot be earlier than startDate."));
            }

            illnesshistory.Curedate = cureDate;
            try
            {
                _repository.Update(illnesshistory);
                _repository.Save();
            }
            catch (DbUpdateConcurrencyException e)
            {
                return StatusCode(500, InternalServerErrorJsonResult(e.Message));
            }

            return Ok(OkEmptyJsonResult);
        }

        // POST: api/Illnesseshistory
        [Authorize(Roles = "doctor,admin")]
        [HttpPost]
        public async Task<ActionResult<Illnesshistory>> PostIllnesshistory(Illnesshistory illnesshistory)
        {
            var visit = _visitsRepository.GetByID(illnesshistory.VisitId);
            if (visit == null)
            {
                return NotFound(NotFoundEmptyJsonResult);
            }
            if (!await _authorizationService.CanUserAccessVisit(visit.ReservationId, this))
            {
                return Unauthorized(UnauthorizedEmptyJsonResult);
            }

            if ((await _repository.GetByVisitId(visit.ReservationId)).Contains(illnesshistory))
            {
                return Conflict(ConflictJsonResult("That illness history already exists"));
            }

            illnesshistory.Id = Decimal.Zero;
            try
            {
                _repository.Insert(illnesshistory);
                _repository.Save();
            }
            catch (DbUpdateException e)
            {
                return StatusCode(500, InternalServerErrorJsonResult(e.Message));
            }
            return Created("", illnesshistory);
        }

        // DELETE: api/Illnesseshistory/5
        [Authorize(Roles = "doctor,admin")]
        [HttpDelete("{illnessHistoryId}")]
        public async Task<ActionResult<Illnesshistory>> DeleteIllnesshistory(decimal illnessHistoryId)
        {
            var illnesshistory = _repository.GetByID(illnessHistoryId);
            if (illnesshistory == null)
            {
                return NotFound(NotFoundEmptyJsonResult);
            }
            if (! await _authorizationService.CanUserAccessIllnessHistory(illnessHistoryId, this))
            {
                return Unauthorized(UnauthorizedEmptyJsonResult);
            }

            try
            {
                _repository.Delete(illnesshistory);
                _repository.Save();
            }
            catch (DbUpdateException e)
            {
                return StatusCode(500, InternalServerErrorJsonResult(e.Message));
            }

            return illnesshistory;
        }

        private bool IllnesshistoryExists(decimal id)
        {
            return _repository.Exists(id);
        }

    }
}
