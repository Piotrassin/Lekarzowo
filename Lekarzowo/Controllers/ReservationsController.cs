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

namespace Lekarzowo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReservationsController : ControllerBase
    {
        private readonly IReservationsRepository _repository;

        public ReservationsController(IReservationsRepository repository)
        {
            _repository = repository;
        }

        #region CRUD

        // GET: api/Reservations
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Reservation>>> GetReservation()
        {
            return Ok(_repository.GetAll());
        }
        
        // GET: api/Reservations/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Reservation>> GetReservation(decimal id)
        {
            var reservation = _repository.GetByID(id);

            if (reservation == null)
            {
                return NotFound();
            }

            return reservation;
        }

        // PUT: api/Reservations/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutReservation(decimal id, Reservation reservation)
        {
            if (id != reservation.Id)
            {
                return BadRequest();
            }

            if (_repository.GetByID(reservation.Id) != null)
            {
                _repository.Update(reservation);
            }

            try
            {
                _repository.Save();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ReservationExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Reservations
        [HttpPost]
        public async Task<ActionResult<Reservation>> PostReservation(Reservation reservation)
        {
            if (ReservationExists(reservation.Id))
            {
                return Conflict("That reservation already exists");
            }
            _repository.Insert(reservation);
            _repository.Save();

            return Created("", reservation);
        }

        // DELETE: api/Reservations/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Reservation>> DeleteReservation(decimal id)
        {
            var reservation = _repository.GetByID(id);
            if (reservation == null)
            {
                return NotFound();
            }

            _repository.Delete(reservation);
            _repository.Save();

            return reservation;
        }

        private bool ReservationExists(decimal id)
        {
            return _repository.Exists(id);
        }

        #endregion

        // GET: api/Reservations/Upcoming?PatientId=1&Limit=5&Skip=2
        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<object>>> Upcoming(decimal PatientId = 0, int Limit = 10, int Skip = 0)
        {
            return Ok(await _repository.UpcomingReservations(PatientId, Limit, Skip));
        }

        // GET: api/Reservations/Recent?PatientId=1&Limit=5&Skip=2
        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<object>>> Recent(decimal PatientId = 0, int Limit = 10, int Skip = 0)
        {
            return Ok(await _repository.RecentReservations(PatientId, Limit, Skip));
        }
    }
}
