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
using Lekarzowo.DataAccessLayer;

namespace Lekarzowo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReservationsController : ControllerBase
    {
        private readonly IReservationsRepository _repository;
        private readonly IWorkingHoursRepository _workHoursRepository;
        private static readonly int chunkSizeMinutes = 15;

        public ReservationsController(IReservationsRepository repository, IWorkingHoursRepository whRepository)
        {
            _repository = repository;
            _workHoursRepository = whRepository;
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

        /// <summary>
        /// dodać wszykiwanie nie tylko po dacie, ale też po godzinie
        /// </summary>
        /// <param name="CityId"></param>
        /// <param name="SpecId"></param>
        /// <param name="DoctorId"></param>
        /// <param name="start"></param>
        /// <param name="end"></param>
        /// <returns></returns>
        // GET: api/reservations/possibleappointments?CityId=1&SpecId=1&DoctorId=1
        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<object>>> PossibleAppointments(decimal? CityId, decimal? SpecId, decimal? DoctorId, DateTime? start, DateTime? end)
        {
            var outputList = new List<Slot>();

            IEnumerable<Reservation> allReservations = _repository.GetAllFutureReservations(CityId, SpecId, DoctorId, start, end);
            IEnumerable<Workinghours> workinghours = _workHoursRepository.GetAllFutureWorkHours(CityId, SpecId, DoctorId, start, end);

            foreach (var workDay in workinghours)
            {
                var reservationsThatDay = allReservations
                    .Where(res => res.Starttime.Date == workDay.From.Date)
                    .Where(res => res.Room.LocalId == workDay.LocalId).ToList();

                var slotsThatDay = CalculatePossibleAppointments(workDay, reservationsThatDay).ToList();
                slotsThatDay.ForEach(x =>
                {
                    x.DoctorId = workDay.DoctorId;
                    x.LocalId = workDay.LocalId;
                });
                outputList.AddRange(slotsThatDay);
            }
            return Ok(outputList);
        }


        private static IEnumerable<Slot> SplitDateRange(DateTime start, DateTime end, int minutesChunkSize)
        {
            DateTime chunkEnd;
            while ((chunkEnd = start.AddMinutes(minutesChunkSize)) < end)
            {
                yield return new Slot(start, chunkEnd);
                start = chunkEnd;
            }
            yield return new Slot(start, end);
        }


        private static List<Slot> SplitChunkIntoSlots (DateTime start, DateTime end, int minuteChunkSize)
        {
            var slots = new List<Slot>();

            if ((start.AddMinutes(chunkSizeMinutes) <= end))
            {
                foreach (var slot in SplitDateRange(start, end, minuteChunkSize))
                {
                    slots.Add(slot);
                }
            }
            return slots;
        }


        private static IEnumerable<Slot> CalculatePossibleAppointments(Workinghours wh, List<Reservation> rlist)
        {
            var slotList = new List<Slot>();

            if(rlist.Count > 0)
            {
                rlist = rlist.OrderBy(x => x.Starttime).ToList();
                slotList = SplitChunkIntoSlots(wh.From, rlist.First().Starttime, chunkSizeMinutes);
                for (int i = 0; i < (rlist.Count - 1); i++)
                {
                    slotList.AddRange(SplitChunkIntoSlots(rlist.ElementAt(i).Endtime, rlist.ElementAt(i + 1).Starttime, chunkSizeMinutes));
                }
                slotList.AddRange(SplitChunkIntoSlots(rlist.Last().Endtime, wh.To, chunkSizeMinutes));
            }
            slotList.AddRange(SplitChunkIntoSlots(wh.From, wh.To, chunkSizeMinutes));
           
            return slotList;
        }

    }
}
