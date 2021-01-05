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
                return NotFound(new JsonResult(""));
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
                return BadRequest(new JsonResult(""));
            }

            if (!IllnessExists(illness.Id))
            {
                return NotFound(new JsonResult(""));
            }

            try
            {
                _repository.Update(illness);
                _repository.Save();
            }
            catch (DbUpdateConcurrencyException e)
            {
                return StatusCode(500, new JsonResult(e.Message));
            }

            return Ok(new JsonResult(""));
        }

        // POST: api/Illnesses
        [Authorize(Roles = "admin")]
        [HttpPost]
        public ActionResult<Doctor> PostIllness(Illness illness)
        {
            if (_repository.Exists(illness.Name))
            {
                return Conflict(new JsonResult("That illness with that name already exists"));
            }

            try
            {
                _repository.Insert(illness);
                _repository.Save();
            }
            catch (DbUpdateException e)
            {
                return StatusCode(500, new JsonResult(e.Message));
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
                return NotFound(new JsonResult(""));
            }

            try
            {
                _repository.Delete(illness);
                _repository.Save();
            }
            catch (DbUpdateException e)
            {
                return StatusCode(500, new JsonResult(e.Message));
            }

            return illness;
        }

        private bool IllnessExists(decimal id)
        {
            return _repository.Exists(id);
        }
    }
}