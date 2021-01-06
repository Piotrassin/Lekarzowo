using System;
using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.Controllers
{
    [Authorize(Roles = "doctor,admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class IllnessesController : BaseController
    {
        private readonly IIllnessesRepository _repository;

        public IllnessesController(IIllnessesRepository repository)
        {
            _repository = repository;
        }

        // GET: api/Illnesses
        [HttpGet]
        public ActionResult<IEnumerable<Illness>> GetIllnesses()
        {
            return _repository.GetAll().ToList();
        }

        // GET: api/Illnesses/AllByName?Name=abc&limit=0&skip=0
        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<Illness>>> AllByName(string name, int? limit, int? skip)
        {
            return Ok(await _repository.GetAllByName(name, limit, skip));
        }

        // GET: api/Illnesses/5
        [HttpGet("{id}")]
        public ActionResult<Illness> GetIllness(decimal id)
        {
            var illness = _repository.GetByID(id);

            if (illness == null)
            {
                return NotFound(NotFoundEmptyJsonResult);
            }

            return illness;
        }

        // PUT: api/Illnesses/5
        [Authorize(Roles = "admin")]
        [HttpPut("{id}")]
        public IActionResult PutIllness(decimal id, Illness illness)
        {
            if (id != illness.Id)
            {
                return BadRequest(BadRequestEmptyJsonResult);
            }

            if (!IllnessExists(illness.Id))
            {
                return NotFound(NotFoundEmptyJsonResult);
            }

            try
            {
                _repository.Update(illness);
                _repository.Save();
            }
            catch (DbUpdateConcurrencyException e)
            {
                return StatusCode(500, InternalServerErrorJsonResult(e.Message));
            }

            return Ok(OkEmptyJsonResult);
        }

        // POST: api/Illnesses
        [Authorize(Roles = "admin")]
        [HttpPost]
        public ActionResult<Doctor> PostIllness(Illness illness)
        {
            if (_repository.Exists(illness.Name))
            {
                return Conflict(ConflictJsonResult("That illness with that name already exists"));
            }

            illness.Id = Decimal.Zero;
            try
            {
                _repository.Insert(illness);
                _repository.Save();
            }
            catch (DbUpdateException e)
            {
                return StatusCode(500, InternalServerErrorJsonResult(e.Message));
            }

            return Created("", illness);
        }

        // DELETE: api/Illnesses/5
        [Authorize(Roles = "admin")]
        [HttpDelete("{id}")]
        public ActionResult<Illness> DeleteIllness(decimal id)
        {
            var illness = _repository.GetByID(id);
            if (illness == null)
            {
                return NotFound(NotFoundEmptyJsonResult);
            }

            try
            {
                _repository.Delete(illness);
                _repository.Save();
            }
            catch (DbUpdateException e)
            {
                return StatusCode(500, InternalServerErrorJsonResult(e.Message));
            }

            return illness;
        }

        private bool IllnessExists(decimal id)
        {
            return _repository.Exists(id);
        }
    }
}