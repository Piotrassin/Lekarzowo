using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class WorkinghoursController : BaseController
    {
        private readonly IWorkingHoursRepository _repository;
        private readonly IReservationsRepository _reservationsRepository;

        public WorkinghoursController(IWorkingHoursRepository repository, IReservationsRepository reservationsRepository)
        {
            _repository = repository;
            _reservationsRepository = reservationsRepository;
        }

        // GET: api/Workinghours
        [Authorize(Roles = "admin")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Workinghours>>> GetWorkinghours()
        {
            return Ok(_repository.GetAll().OrderBy(x => x.From.Date).ThenBy(x => x.From.TimeOfDay));
        }

        // GET: api/Workinghours/5
        [Authorize]
        [HttpGet("{doctorId}")]
        public async Task<ActionResult<Workinghours>> GetWorkinghours(decimal doctorId)
        {
            var workinghours = _repository.GetByID(doctorId);

            if (workinghours == null)
            {
                return NotFound();
            }

            return workinghours;
        }

        // GET: api/workinghours/DoctorsWorkplacesByName?doctorId=1
        [Authorize]
        [HttpGet("[action]")]
        public async Task<ActionResult<object>> DoctorsWorkplacesByName(string localName, decimal? doctorId, int? skip, int? limit)
        {
            var workplaces = await _repository.DoctorsWorkplacesByName(localName, doctorId, skip, limit);

            if (workplaces == null)
            {
                return NotFound();
            }

            return Ok(workplaces);
        }

        // GET: api/workinghours/DoctorsUpcomingSchedule?doctorId=1&days=2000
        [Authorize]
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
        [Authorize(Roles = "doctor,admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutWorkinghours(decimal id, Workinghours workhours)
        {
            if (id != workhours.Id) return BadRequest();
            if (IsDoctorAccessingElsesData(workhours.DoctorId)) return Unauthorized();
            if (await _reservationsRepository.IsAnyReservationScheduledThatDay(workhours.LocalId, workhours.DoctorId, workhours.From, workhours.To))
            {
                return Forbid("W ciągu tych godzin pracy stworzono już rezerwację.");
            }

            if (!WorkinghoursExists(id)) return NotFound();
            try
            {
                _repository.Update(workhours);
                _repository.Save();
            }
            catch (DbUpdateConcurrencyException e)
            {
                return StatusCode(500, e.Message);
            }
            return NoContent();
        }

        // POST: api/Workinghours
        [Authorize(Roles = "doctor,admin")]
        [HttpPost]
        public async Task<ActionResult<Workinghours>> PostWorkinghours(Workinghours workinghours)
        {
            if (IsDoctorAccessingElsesData(workinghours.DoctorId)) return Unauthorized();
            try
            {
                _repository.Insert(workinghours);
                _repository.Save();
            }
            catch (DbUpdateException e)
            {
                return StatusCode(500, e.Message);
            }
            return Created("", workinghours);
        }

        // DELETE: api/Workinghours/5
        [Authorize(Roles = "doctor,admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult<Workinghours>> DeleteWorkinghours(decimal id)
        {
            var workhours = _repository.GetByID(id);
            if (workhours == null) return NotFound();
            if (IsDoctorAccessingElsesData(workhours.DoctorId)) return Unauthorized();
            if (await _reservationsRepository.IsAnyReservationScheduledThatDay(workhours.LocalId, workhours.DoctorId, workhours.From, workhours.To))
            {
                return Forbid("W ciągu tych godzin pracy stworzono już rezerwację.");
            }

            _repository.Delete(workhours);
            _repository.Save();

            return workhours;
        }

        private bool WorkinghoursExists(decimal id)
        {
            return _repository.Exists(id);
        }
        
        private bool IsDoctorAccessingElsesData(decimal doctorId)
        {
            return IsDoctor() && doctorId != GetUserIdFromToken();
        }
    }
}
