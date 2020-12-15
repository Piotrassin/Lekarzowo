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
using Lekarzowo.DataAccessLayer.DTO;
using Lekarzowo.DataAccessLayer.Repositories;

namespace Lekarzowo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WorkinghoursController : ControllerBase
    {
        private readonly IWorkingHoursRepository _repository;
        private readonly ILocalsRepository _localRepository;

        public WorkinghoursController(IWorkingHoursRepository repository, ILocalsRepository locRepo)
        {
            _repository = repository;
            _localRepository = locRepo;
        }

        // GET: api/Workinghours
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Workinghours>>> GetWorkinghours()
        {
            return Ok(_repository.GetAll());
        }

        // GET: api/Workinghours/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Workinghours>> GetWorkinghours(decimal id)
        {
            var workinghours = _repository.GetByID(id);

            if (workinghours == null)
            {
                return NotFound();
            }

            return workinghours;
        }

        // GET: api/workinghours/DoctorsUpcomingSchedule?doctorId=1&days=2000
        [HttpGet("[action]")]
        public async Task<ActionResult<object>> DoctorsUpcomingSchedule(decimal doctorId, int days)
        {
            var workplaces = await _repository.DoctorsWorkplaces(doctorId); 

            if (workplaces == null || !workplaces.Any())
            {
                return NotFound();
            }
            foreach (var workplace in workplaces)
            {
                workplace.Workinghours = (ICollection<Workinghours>) await _repository.DoctorUpcomingWorkingHours(doctorId, workplace.Id, days);
            }

            return Ok(workplaces);
        }

        // PUT: api/Workinghours/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutWorkinghours(decimal id, Workinghours workinghours)
        {
            if (id != workinghours.Id)
            {
                return BadRequest();
            }

            try
            {

                _repository.Update(workinghours);
                _repository.Save();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!WorkinghoursExists(id))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }

        // POST: api/Workinghours
        [HttpPost]
        public async Task<ActionResult<Workinghours>> PostWorkinghours(Workinghours workinghours)
        {
            try
            {
                _repository.Insert(workinghours);
                _repository.Save();

                return Created("", workinghours);
            }
            catch (DbUpdateException)
            {
                return StatusCode(503);
            }
        }

        // DELETE: api/Workinghours/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Workinghours>> DeleteWorkinghours(decimal id)
        {
            var workinghours = _repository.GetByID(id);
            if (workinghours == null)
            {
                return NotFound();
            }

            _repository.Delete(workinghours);
            _repository.Save();

            return workinghours;
        }

        private bool WorkinghoursExists(decimal id)
        {
            return _repository.Exists(id);
        }

        private async Task<bool> WorkinghoursExists(Workinghours wh)
        {
            return await _repository.Exists(wh);
        }
    }
}
