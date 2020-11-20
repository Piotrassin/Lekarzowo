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
using Lekarzowo.Services;

namespace Lekarzowo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReservationsController : ControllerBase
    {
        private readonly IReservationsRepository _repository;
        private readonly IWorkingHoursRepository _workHoursRepository;
        private static readonly int chunkSizeMinutes = 15;
        private static readonly int defaultLimit = 15;
        private static readonly int defaultSkip = 0;

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

        // GET: api/reservations/possibleappointments?CityId=1&SpecId=1&DoctorId=1
        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<object>>> PossibleAppointments(decimal? CityId, decimal? SpecId, decimal? DoctorId, DateTime? start, DateTime? end, int? limit, int? skip)
        {
            IEnumerable<Reservation> allReservations = _repository.GetAllFutureReservations(CityId, SpecId, DoctorId, start, end);
            IEnumerable<Workinghours> workinghours = _workHoursRepository.GetAllFutureWorkHours(CityId, SpecId, DoctorId, start, end);

            var slotList = CalcPossibleAppointments(allReservations, workinghours);

            if (start.HasValue && end.HasValue)
            {
                slotList = slotList.Where(x => x.Start >= start && x.End <= end).ToList();
            }

            PaginationService.SplitAndLimit(skip, limit, slotList);

            slotList = skip.HasValue ? slotList.Skip(skip.Value) : slotList.Skip(defaultSkip);
            slotList = limit.HasValue ? slotList.Take(limit.Value) : slotList.Take(defaultLimit);

            return Ok(slotList);
        }


        private static IEnumerable<SlotDTO> CalcPossibleAppointments(IEnumerable<Reservation> allReservations, IEnumerable<Workinghours> workinghours)
        {
            var outputList = new List<SlotDTO>();

            foreach (var workDay in workinghours)
            {
                var reservationsThatDay = allReservations
                    .Where(res => res.Starttime.Date == workDay.From.Date)
                    .Where(res => res.Room.LocalId == workDay.LocalId)
                    .Where(res => res.DoctorId == workDay.DoctorId).ToList();

                var slotsThatDay = SplitDayIntoChunks(workDay, reservationsThatDay).ToList();
                slotsThatDay.ForEach(x =>
                {
                    x.DoctorId = workDay.DoctorId;
                    x.DoctorName = workDay.Doctor.IdNavigation.Name;
                    x.DoctorLastname = workDay.Doctor.IdNavigation.Lastname;
                    x.DoctorSpecialization = workDay.Doctor.Speciality.Name;
                    x.DoctorBasePrice = workDay.Doctor.Speciality.Price;
                    x.LocalName = workDay.Local.Name;
                });
                outputList.AddRange(slotsThatDay);
            }

            return outputList;
        }

        private static IEnumerable<SlotDTO> SplitDayIntoChunks(Workinghours wh, List<Reservation> rlist)
        {
            var slotList = new List<SlotDTO>();

            if (rlist.Count > 0)
            {
                rlist = rlist.OrderBy(x => x.Starttime).ToList();
                //podziel na sloty, okres między początkiem pracy, a pierwszą wizytą
                slotList = SplitChunkIntoSlots(wh.From, rlist.First().Starttime, chunkSizeMinutes);
                for (int i = 0; i < (rlist.Count - 1); i++)
                {
                    //podziel na sloty, okres między końcem i-tej wizyty, a początkiem (i+1)-szej wizyty
                    slotList.AddRange(SplitChunkIntoSlots(rlist.ElementAt(i).Endtime, rlist.ElementAt(i + 1).Starttime, chunkSizeMinutes));
                }
                //podziel na sloty, okres między końcem ostatniej wizyty, a końcem dnia pracy
                slotList.AddRange(SplitChunkIntoSlots(rlist.Last().Endtime, wh.To, chunkSizeMinutes));
            }
            //gdy nie ma wizyt tego dnia, podziel cały dzień na sloty
            slotList.AddRange(SplitChunkIntoSlots(wh.From, wh.To, chunkSizeMinutes));

            return slotList;
        }

        private static List<SlotDTO> SplitChunkIntoSlots (DateTime start, DateTime end, int minuteChunkSize)
        {
            var slots = new List<SlotDTO>();

            if ((start.AddMinutes(chunkSizeMinutes) <= end))
            {
                foreach (var slot in GenerateSlots(start, end, minuteChunkSize))
                {
                    slots.Add(slot);
                }
            }
            return slots;
        }

        private static IEnumerable<SlotDTO> GenerateSlots(DateTime start, DateTime end, int minutesChunkSize)
        {
            DateTime chunkEnd;
            while ((chunkEnd = start.AddMinutes(minutesChunkSize)) < end)
            {
                yield return new SlotDTO(start, chunkEnd);
                start = chunkEnd;
            }
            yield return new SlotDTO(start, end);
        }


    }
}
