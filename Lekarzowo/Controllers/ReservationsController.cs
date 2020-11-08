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

        // GET: api/Reservations/PossibleAppointments
        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<object>>> PossibleAppointments()
        {
            #region prototyp

            //Workinghours wh = new Workinghours() {
            //    DoctorId = 1,
            //    From = new DateTime(2021, 3, 21, 8, 00, 00),
            //    To = new DateTime(2021, 3, 21, 16, 00, 00),
            //    LocalId = 1001
            //};
            //Workinghours wh1 = new Workinghours()
            //{
            //    DoctorId = 1,
            //    From = new DateTime(2021, 3, 22, 9, 00, 00),
            //    To = new DateTime(2021, 3, 22, 17, 00, 00),
            //    LocalId = 1001
            //};

            //Room room1 = new Room()
            //{
            //    Id = 1000,
            //    LocalId = 1001,
            //    Number = 123
            //};
            //Room room2 = new Room()
            //{
            //    Id = 2000,
            //    LocalId = 1001,
            //    Number = 125
            //};

            //Reservation r1 = new Reservation()
            //{
            //    DoctorId = 1,
            //    Id = 1234,
            //    PatientId = 4444,
            //    RoomId = 1000,
            //    Starttime = new DateTime(2021, 3, 21, 9, 00, 00),
            //    Endtime = new DateTime(2021, 3, 21, 9, 30, 00),
            //    Canceled = 0,
            //    Room = room1
            //};
            //Reservation r2 = new Reservation()
            //{
            //    DoctorId = 1,
            //    Id = 1235,
            //    PatientId = 4445,
            //    RoomId = 2000,
            //    Starttime = new DateTime(2021, 3, 21, 10, 15, 00),
            //    Endtime = new DateTime(2021, 3, 21, 11, 00, 00),
            //    Canceled = 0,
            //    Room = room2
            //};
            //Reservation r3 = new Reservation()
            //{
            //    DoctorId = 1,
            //    Id = 1236,
            //    PatientId = 4446,
            //    RoomId = 2000,
            //    Starttime = new DateTime(2021, 3, 21, 11, 15, 00),
            //    Endtime = new DateTime(2021, 3, 21, 11, 45, 00),
            //    Canceled = 0,
            //    Room = room2
            //};
            //Reservation r4 = new Reservation()
            //{
            //    DoctorId = 1,
            //    Id = 1237,
            //    PatientId = 4444,
            //    RoomId = 2000,
            //    Starttime = new DateTime(2021, 3, 21, 15, 15, 00),
            //    Endtime = new DateTime(2021, 3, 21, 16, 00, 00),
            //    Canceled = 0,
            //    Room = room2
            //};

            //room1.Reservation.Add(r1);
            //room1.Reservation.Add(r2);
            //room1.Reservation.Add(r3);
            //room1.Reservation.Add(r4);

            //var whList = new List<Workinghours> { wh, wh1 };
            //var rList = new List<Reservation> { r1, r2, r3, r4 };

            //whList = whList.OrderBy(x => x.From).ToList();
            //rList = rList.OrderBy(x => x.Starttime).ToList();

            #endregion

            var outputList = new List<Slot>();

            var allReservations = _repository.GetAllFutureReservations();
            var workinghours = _workHoursRepository.GetAllFutureWorkHours();

            var rList = allReservations.OrderBy(x => x.Starttime).ToList();
            var whList = workinghours.OrderBy(x => x.From).ToList();

            foreach (var workDay in whList)
            {
                var reservationsThatDay = rList
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


        public static IEnumerable<Slot> SplitDateRange(DateTime start, DateTime end, int minutesChunkSize)
        {
            DateTime chunkEnd;
            while ((chunkEnd = start.AddMinutes(minutesChunkSize)) < end)
            {
                yield return new Slot(start, chunkEnd);
                start = chunkEnd;
            }
            yield return new Slot(start, end);
        }


        public static List<Slot> SplitChunkIntoSlots (DateTime start, DateTime end, int minuteChunkSize)
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


        public static IEnumerable<Slot> CalculatePossibleAppointments(Workinghours wh, List<Reservation> rlist)
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
