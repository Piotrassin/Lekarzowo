﻿using Lekarzowo.DataAccessLayer.DTO;
using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using Lekarzowo.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace Lekarzowo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReservationsController : BaseController
    {
        private readonly IReservationsRepository _repository;
        private readonly IWorkingHoursRepository _workHoursRepository;
        private readonly IRoomsRepository _roomsRepository;

        public static readonly int chunkSizeMinutes = 15;

        public ReservationsController(IReservationsRepository repository, 
            IWorkingHoursRepository whRepo, IRoomsRepository roomRepo)
        {
            _repository = repository;
            _workHoursRepository = whRepo;
            _roomsRepository = roomRepo;
        }

        #region CRUD

        // GET: api/Reservations
        [Authorize(Roles = "doctor,admin")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Reservation>>> GetReservation()
        {
            return Ok(_repository.GetAll());
        }

        // GET: api/Reservations/5
        [Authorize]
        [HttpGet("{reservationId}")]
        public async Task<ActionResult<Reservation>> GetReservation(decimal reservationId)
        {
            if (await IsPatientAccessingDataOwnedByOtherUser(reservationId)) return Unauthorized();

            var reservation = await _repository.GetById(reservationId);

            if (reservation == null)
            {
                return NotFound();
            }
            return reservation;
        }

        // GET: api/Reservations/WithPatientData/5
        [Authorize]
        [HttpGet("[action]/{reservationId}")]
        public async Task<ActionResult<object>> WithPatientData(decimal reservationId)
        {
            if (await IsPatientAccessingDataOwnedByOtherUser(reservationId)) return Unauthorized();

            var reservation = await _repository.GetByIdWithPatientData(reservationId);

            if (reservation == null)
            {
                return NotFound();
            }
            return reservation;
        }


        /// <summary>
        /// TODO: ZROBIĆ WALIDACJĘ
        /// </summary>
        /// <param name="id"></param>
        /// <param name="reservation"></param>
        /// <returns></returns>
        // PUT: api/Reservations/5
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutReservation(decimal id, Reservation reservation)
        {
            if (!_repository.Exists(id)) return NotFound();
            if (id != reservation.Id) return BadRequest();
            if(await IsPatientAccessingDataOwnedByOtherUser(id)) return Unauthorized();

            try
            {
                _repository.Update(reservation);
                _repository.Save();
            }
            catch (DbUpdateConcurrencyException e)
            {
                return StatusCode(500, e.Message);
            }
            return NoContent();
        }

        // POST: api/Reservations
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Reservation>> PostReservation(ReservationDTO input)
        {
            if (IsPatient() && input.PatientId != GetUserIdFromToken()) return Unauthorized();

            var room = await FindAvailableRoom(input);
            if (room == null) return BadRequest("Brak dostępnych pokoi w lokalu.");

            try
            {
                var reservationToInsert = new Reservation
                {
                    DoctorId = input.DoctorId,
                    PatientId = input.PatientId,
                    Starttime = input.Starttime,
                    Endtime = input.Endtime,
                    Canceled = input.Canceled,
                    RoomId = room.Id
                };
                _repository.Insert(reservationToInsert);
                _repository.Save();
                return Created("", reservationToInsert);
            }
            catch (DbUpdateConcurrencyException e)
            {
                return StatusCode(500, e.Message);
            }
        }

        // DELETE: api/Reservations/5
        [Authorize(Roles = "doctor,admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult<Reservation>> DeleteReservation(decimal id)
        {
            var reservation = await _repository.GetById(id);
            if (reservation == null) return NotFound();
            if (reservation.Visit != null && reservation.Visit.OnGoing) return BadRequest("Na tej rezerwacji odbywa się właśnie wizyta.");

            _repository.Delete(reservation);
            _repository.Save();

            return reservation;
        }

        #endregion

        // GET: api/Reservations/RecentByDoctorId?doctorId=1&localId=1&start=2020-05-10&end=2026-05-20
        [Authorize(Roles = "doctor,admin")]
        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<object>>> RecentByDoctorId(decimal doctorId, decimal localId, DateTime? start, DateTime? end)
        {
            if (IsDoctor() && doctorId != GetUserIdFromToken())
            {
                return Unauthorized();
            }

            if (start == null || start > end || start > DateTime.Now)
            {
                start = DateTime.Now.Date.AddDays(-7);
            }
            if (end == null || end > DateTime.Now)
            {
                end = DateTime.Now;
            }

            return Ok(await _repository.DoctorScheduleList(doctorId, localId, true, start, end));
        }

        // GET: api/Reservations/UpcomingByDoctorId?doctorId=1&localId=1&start=2020-05-10&end=2026-05-20
        [Authorize(Roles = "doctor,admin")]
        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<object>>> UpcomingByDoctorId(decimal doctorId, decimal localId, DateTime? start, DateTime? end)
        {
            if (IsDoctor() && doctorId != GetUserIdFromToken())
            {
                return Unauthorized();
            }

            if (start == null || start > end || start < DateTime.Now)
            {
                start = DateTime.Now.Date;
            }
            if (end == null || end < DateTime.Now)
            {
                end = DateTime.Now.AddDays(7);
            } 
            
            return Ok(await _repository.DoctorScheduleList(doctorId, localId, false, start, end));
        }

        // GET: api/Reservations/Upcoming?PatientId=1&Limit=5&Skip=2
        [Authorize]
        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<object>>> Upcoming(decimal patientId, int? limit, int? skip)
        {
            if (IsPatient())
            {
                if (patientId != GetUserIdFromToken())
                {
                    return Unauthorized();
                }
                return Ok(await _repository.RecentOrUpcomingReservations(patientId, true, true, limit, skip));
            }
            return Ok(await _repository.RecentOrUpcomingReservations(patientId, true, false, limit, skip));
        }

        // GET: api/Reservations/Recent?PatientId=1&Limit=5&Skip=2
        [Authorize]
        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<object>>> Recent(decimal patientId, int? limit, int? skip)
        {
            if (IsPatient())
            {
                if (patientId != GetUserIdFromToken())
                {
                    return Unauthorized();
                }
                return Ok(await _repository.RecentOrUpcomingReservations(patientId, false, true, limit, skip));
            }
            return Ok(await _repository.RecentOrUpcomingReservations(patientId, false, false, limit, skip));
        }

        // GET: api/reservations/possibleappointments?CityId=2&SpecId=1&DoctorId=1&startDate=2020-12-20&endDate=2020-12-30&startHour=09:00:00&endHour=10:30:00
        [Authorize]
        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<object>>> PossibleAppointments(decimal? cityId, decimal? specId, decimal? doctorId, DateTime? startHour, DateTime? endHour, DateTime? startDate, DateTime? endDate, int? limit, int? skip)
        {
            //TODO: może przenieść do walidacji w jakiś sposób?
            if((cityId.HasValue && !specId.HasValue && doctorId.HasValue)
                || (cityId.HasValue && !specId.HasValue && !doctorId.HasValue)
                || (!cityId.HasValue && specId.HasValue && doctorId.HasValue)
                || (!cityId.HasValue && !specId.HasValue && !doctorId.HasValue))
            {
                return BadRequest("Niepoprawne kryteria wyszukiwania");
            }

            IEnumerable<Reservation> allReservations = _repository.AllByOptionalCriteria(cityId, specId, doctorId, startDate, endDate);
            IEnumerable<Workinghours> workinghours = _workHoursRepository.GetAllFutureWorkHours(cityId, specId, doctorId, startDate, endDate);

            var slotList = CalcPossibleAppointments(allReservations, workinghours);

            if (startDate.HasValue && endDate.HasValue)
            {
                slotList = slotList.Where(x => x.Start.Date >= startDate.Value.Date && x.End.Date <= endDate.Value.Date).ToList();
            }
            if (startHour.HasValue && endHour.HasValue)
            {
                slotList = slotList.Where(x => x.Start.TimeOfDay >= startHour.Value.TimeOfDay && x.End.TimeOfDay <= endHour.Value.TimeOfDay).ToList();
            }

            slotList = PaginationService<SlotDTO>.SplitAndLimitIEnumerable(skip, limit, slotList);

            return Ok(slotList);
        }

        // GET: api/Reservations/Cancel/5
        [Authorize(Roles = "patient,doctor,admin")]
        [HttpGet("[action]/{reservationId}")]
        public async Task<IActionResult> Cancel(decimal reservationId)
        {
            if (await IsPatientAccessingDataOwnedByOtherUser(reservationId)) return Unauthorized();

            var result = await GetReservation(reservationId);
            if (result.Value == null)
            {
                return NotFound();
            }
            var reservation = result.Value;
            reservation.Canceled = true;
            return await PutReservation(reservationId, reservation);
        }


        #region Slots
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
                    x.LocalId = workDay.LocalId;
                    x.LocalName = workDay.Local.Name;
                    x.DoctorId = workDay.DoctorId;
                    x.DoctorName = workDay.Doctor.IdNavigation.Name;
                    x.DoctorLastname = workDay.Doctor.IdNavigation.Lastname;
                    x.DoctorSpecialization = workDay.Doctor.Speciality.Name;
                    x.DoctorBasePrice = workDay.Doctor.Speciality.Price;
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
            else
            {
                //gdy nie ma wizyt tego dnia, podziel cały dzień na sloty
                slotList.AddRange(SplitChunkIntoSlots(wh.From, wh.To, chunkSizeMinutes));
            }

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
        #endregion

        private bool ReservationExists(decimal id)
        {
            return _repository.Exists(id);
        }

        private async Task<Room> FindAvailableRoom(ReservationDTO res)
        {
            var reservationsInProgress = await _repository.AllInProgressByLocal(res.LocalId, res.Starttime, res.Endtime);
            var allRoomsInALocal = await _roomsRepository.GetAllByLocalId(res.LocalId);

            var takenRoomIdsUnique = reservationsInProgress.Select(x => x.RoomId).Distinct().ToList();
            var availableRoomIds = allRoomsInALocal.Select(x => x.Id).Except(takenRoomIdsUnique).ToList();

            return _roomsRepository.GetByID(availableRoomIds.FirstOrDefault());
        }

        private async Task<bool> IsPatientAccessingDataOwnedByOtherUser(decimal reservationId)
        {
            return IsPatient() && (! await _repository.IsOwnedByPatient(GetUserIdFromToken(), reservationId));
        }
    }
}
