using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using Lekarzowo.Helpers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Lekarzowo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UIComponentsController : ControllerBase
    {
        private readonly IUserInterfaceComponentsRepository _repository;

        public UIComponentsController(IUserInterfaceComponentsRepository repository)
        {
            _repository = repository;
        }

        #region STARE WIDOKI
        
        // GET: api/SQLPerspectives/AddressData/1
        [HttpGet("[action]/{RoomId}")]
        public async Task<ActionResult<IEnumerable<object>>> AddressData(decimal RoomId)
        {
            return Ok(await _repository.AddressData(RoomId));
        }

        // GET: api/SQLPerspectives/DoctorsAndSpecializations/1
        [HttpGet("[action]/{DoctorId}")]
        public async Task<ActionResult<IEnumerable<object>>> DoctorsAndSpecs(decimal DoctorId)
        {
            return Ok(await _repository.DoctorsAndSpecializations(DoctorId));
        }

        // GET: api/SQLPerspectives/DoctorSchedule/1/1
        [HttpGet("[action]/{DoctorId}/{LocalId}")]
        public async Task<ActionResult<IEnumerable<object>>> DoctorSchedule(decimal DoctorId, decimal LocalId)
        {
            return Ok(await _repository.DoctorSchedule(DoctorId, LocalId));
        }

        // GET: api/sqlperspectives/DoctorsList?SpecId=1&CityId=1
        [HttpGet("[action]/{SpecId?}/{CityId?}")]
        public async Task<ActionResult<IEnumerable<object>>> DoctorsList([FromQuery] decimal? SpecId, [FromQuery] decimal? CityId)
        {
            return Ok(await _repository.DoctorsList(SpecId, CityId));
        }

        // GET: api/SQLPerspectives/IllnessAndMedicinesDetails/1/1
        [HttpGet("[action]/{PatientId}/{IllnessId}")]
        public async Task<ActionResult<IEnumerable<object>>> IllnessAndMedicinesDetails(decimal PatientId, decimal IllnessId)
        {
            return Ok(await _repository.IllnessAndMedicinesDetails(PatientId, IllnessId));
        }

        // GET: api/SQLPerspectives/IllnessAndMedicinesList/1
        [HttpGet("[action]/{PatientId}")]
        public async Task<ActionResult<IEnumerable<object>>> IllnessAndMedicinesList(decimal PatientId)
        {
            return Ok(await _repository.IllnessAndMedicinesList(PatientId));
        }

        // GET: api/SQLPerspectives/PatientIllnesses/1
        [HttpGet("[action]/{PatientId}")]
        public async Task<ActionResult<IEnumerable<object>>> PatientIllnesses(decimal PatientId)
        {
            return Ok(await _repository.PatientIllnesses(PatientId));
        }

        // GET: api/SQLPerspectives/VisitDetails/1
        [HttpGet("[action]/{ReservationId}")]
        public async Task<ActionResult<IEnumerable<object>>> VisitDetails(decimal ReservationId)
        {
            return Ok(await _repository.VisitDetails(ReservationId));
        }

        // GET: api/SQLPerspectives/VisitList/1
        [HttpGet("[action]/{PatientId}")]
        public async Task<ActionResult<IEnumerable<object>>> VisitList(decimal PatientId)
        {
            return Ok(await _repository.VisitList(PatientId));
        }

        #endregion


        // GET: api/UIComponents/IllnessesHistory/1
        [HttpGet("[action]/{PatientId}")]
        public async Task<ActionResult<IEnumerable<object>>> IllnessesHistory(decimal PatientId)
        {
            return Ok(await _repository.IllnessesHistory(PatientId));
        }

        // GET: api/UIComponents/TakenMedicines/1
        [HttpGet("[action]/{PatientId}")]
        public async Task<ActionResult<IEnumerable<object>>> TakenMedicines(decimal PatientId)
        {
            return Ok(await _repository.TakenMedicines(PatientId));
        }

        // GET: api/UIComponents/PerformedTreatments/1
        [HttpGet("[action]/{PatientId}")]
        public async Task<ActionResult<IEnumerable<object>>> PerformedTreatments(decimal VisitId)
        {
            return Ok(await _repository.PerformedTreatments(VisitId));
        }

        // GET: api/UIComponents/PrescribedMedicines/1
        [HttpGet("[action]/{PatientId}")]
        public async Task<ActionResult<IEnumerable<object>>> PrescribedMedicines(decimal VisitId)
        {
            return Ok(await _repository.PrescribedMedicines(VisitId));
        }

    }
}