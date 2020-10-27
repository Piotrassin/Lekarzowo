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
    public class SQLPerspectivesController : ControllerBase
    {
        private readonly ISQLPerspectivesRepository _repositorySQL;

        public SQLPerspectivesController(ISQLPerspectivesRepository repository)
        {
            _repositorySQL = repository;
        }


        // GET: api/SQLPerspectives/AddressData/1
        [HttpGet("[action]/{RoomId}")]
        public async Task<ActionResult<IEnumerable<object>>> AddressData(decimal RoomId)
        {
            return Ok(await _repositorySQL.AddressData(RoomId));
        }

        // GET: api/SQLPerspectives/DoctorsAndSpecializations/1
        [HttpGet("[action]/{DoctorId}")]
        public async Task<ActionResult<IEnumerable<object>>> DoctorsAndSpecs(decimal DoctorId)
        {
            return Ok(await _repositorySQL.DoctorsAndSpecializations(DoctorId));
        }

        // GET: api/SQLPerspectives/DoctorSchedule/1/1
        [HttpGet("[action]/{DoctorId}/{LocalId}")]
        public async Task<ActionResult<IEnumerable<object>>> DoctorSchedule(decimal DoctorId, decimal LocalId)
        {
            return Ok(await _repositorySQL.DoctorSchedule(DoctorId, LocalId));
        }

        // GET: api/sqlperspectives/DoctorsList?SpecId=1&CityId=1
        [HttpGet("[action]/{SpecId?}/{CityId?}")]
        public async Task<ActionResult<IEnumerable<object>>> DoctorsList([FromQuery] decimal? SpecId, [FromQuery] decimal? CityId)
        {
            return Ok(await _repositorySQL.DoctorsList(SpecId, CityId));
        }

        // GET: api/SQLPerspectives/IllnessAndMedicinesDetails/1/1
        [HttpGet("[action]/{PatientId}/{IllnessId}")]
        public async Task<ActionResult<IEnumerable<object>>> IllnessAndMedicinesDetails(decimal PatientId, decimal IllnessId)
        {
            return Ok(await _repositorySQL.IllnessAndMedicinesDetails(PatientId, IllnessId));
        }

        // GET: api/SQLPerspectives/IllnessAndMedicinesList/1
        [HttpGet("[action]/{PatientId}")]
        public async Task<ActionResult<IEnumerable<object>>> IllnessAndMedicinesList(decimal PatientId)
        {
            return Ok(await _repositorySQL.IllnessAndMedicinesList(PatientId));
        }

        // GET: api/SQLPerspectives/PatientIllnesses/1
        [HttpGet("[action]/{PatientId}")]
        public async Task<ActionResult<IEnumerable<object>>> PatientIllnesses(decimal PatientId)
        {
            return Ok(await _repositorySQL.PatientIllnesses(PatientId));
        }

        // GET: api/SQLPerspectives/VisitDetails/1
        [HttpGet("[action]/{ReservationId}")]
        public async Task<ActionResult<IEnumerable<object>>> VisitDetails(decimal ReservationId)
        {
            return Ok(await _repositorySQL.VisitDetails(ReservationId));
        }

        // GET: api/SQLPerspectives/VisitList/1
        [HttpGet("[action]/{PatientId}")]
        public async Task<ActionResult<IEnumerable<object>>> VisitList(decimal PatientId)
        {
            return Ok(await _repositorySQL.VisitList(PatientId));
        }
    }
}