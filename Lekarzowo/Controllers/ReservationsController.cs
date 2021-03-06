﻿using Lekarzowo.DataAccessLayer.DTO;
using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using Lekarzowo.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Lekarzowo.DataAccessLayer.Repositories;

namespace Lekarzowo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReservationsController : BaseController
    {
        private readonly IReservationsRepository _repository;
        private readonly IWorkingHoursRepository _workHoursRepository;
        private readonly IRoomsRepository _roomsRepository;
        private readonly IDoctorsRepository _doctorsRepository; 
        private readonly ISpecialitiesRepository _specialitiesRepository;
        private readonly AuthorizationService _authorizationService;

        public const int defaultChunkSizeMinutes = 15;

        public ReservationsController(IReservationsRepository repository, IWorkingHoursRepository whRepo, 
            IRoomsRepository roomRepo, IDoctorsRepository doctorsRepository, 
            ISpecialitiesRepository specialitiesRepository, AuthorizationService authorizationService)
        {
            _repository = repository;
            _workHoursRepository = whRepo;
            _roomsRepository = roomRepo;
            _doctorsRepository = doctorsRepository;
            _specialitiesRepository = specialitiesRepository;
            _authorizationService = authorizationService;
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
            if (! await _authorizationService.CanUserAccessVisit(reservationId, this)) return Unauthorized(UnauthorizedEmptyJsonResult);

            var reservation = await _repository.GetByID(reservationId);

            if (reservation == null)
            {
                return NotFound(NotFoundEmptyJsonResult);
            }
            return reservation;
        }

        // GET: api/Reservations/WithPatientData/5
        [Authorize]
        [HttpGet("[action]/{reservationId}")]
        public async Task<ActionResult<object>> WithPatientData(decimal reservationId)
        {
            if (! await _authorizationService.CanUserAccessVisit(reservationId, this)) return Unauthorized(UnauthorizedEmptyJsonResult);

            var reservation = await _repository.GetByIdWithPatientData(reservationId);

            if (reservation == null)
            {
                return NotFound(NotFoundEmptyJsonResult);
            }

            return reservation;
        }

        // PUT: api/Reservations/5
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutReservation(decimal id, Reservation reservation)
        {
            if (!_repository.Exists(id)) return NotFound(NotFoundEmptyJsonResult);
            if (id != reservation.Id) return BadRequest(BadRequestEmptyJsonResult);
            if(! await _authorizationService.CanUserAccessVisit(id, this)) return Unauthorized(UnauthorizedEmptyJsonResult);

            try
            {
                _repository.Update(reservation);
                _repository.Save();
            }
            catch (DbUpdateConcurrencyException e)
            {
                return StatusCode(500, InternalServerErrorJsonResult(e.Message));
            }
            return Ok(OkEmptyJsonResult);
        }

        // POST: api/Reservations
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Reservation>> PostReservation(ReservationDTO input)
        {
            if (UserIsPatientAndDoesntHaveAccess(input.PatientId)) return Unauthorized(UnauthorizedEmptyJsonResult);

            var room = await FindAvailableRoom(input);
            if (room == null) return BadRequest(BadRequestJsonResult("No rooms available in that local."));

            var reservationToInsert = new Reservation
            {
                DoctorId = input.DoctorId,
                PatientId = input.PatientId,
                Starttime = input.Starttime,
                Endtime = input.Endtime,
                Canceled = input.Canceled,
                RoomId = room.Id
            };

            try
            {
                _repository.Insert(reservationToInsert);
                _repository.Save();
            }
            catch (DbUpdateConcurrencyException e)
            {
                return StatusCode(500, InternalServerErrorJsonResult(e.Message));
            }

            return Created("", reservationToInsert);
        }

        // DELETE: api/Reservations/5
        [Authorize(Roles = "doctor,admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult<Reservation>> DeleteReservation(decimal id)
        {
            var reservation = await _repository.GetByID(id);

            if (reservation == null) return NotFound(NotFoundEmptyJsonResult);
            if(! await _authorizationService.CanUserAccessVisit(id, this)) return Unauthorized(UnauthorizedEmptyJsonResult);
            if (reservation.Visit != null && reservation.Visit.OnGoing) return BadRequest(BadRequestJsonResult("Na tej rezerwacji odbywa się właśnie wizyta."));

            try
            {
                _repository.Delete(reservation);
                _repository.Save();
            }
            catch (DbUpdateException e)
            {
                return StatusCode(500, InternalServerErrorJsonResult(e.Message));
            }

            return reservation;
        }

        #endregion

        // GET: api/Reservations/RecentByDoctorId?doctorId=1&localId=1&start=2020-05-10&end=2026-05-20
        [Authorize(Roles = "doctor,admin")]
        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<object>>> RecentByDoctorId(decimal doctorId, DateTime? start, DateTime? end, int? limit, int? skip)
        {
            if (UserIsDoctorAndDoesntHaveAccess(doctorId))
            {
                return Unauthorized(UnauthorizedEmptyJsonResult);
            }

            if (start == null || start > end || start > DateTime.Now)
            {
                start = DateTime.Now.Date.AddDays(-7);
            }
            if (end == null || end > DateTime.Now)
            {
                end = DateTime.Now;
            }

            return Ok(await _repository.DoctorScheduleList(doctorId, true, start, end, limit, skip));
        }

        // GET: api/Reservations/UpcomingByDoctorId?doctorId=1&localId=1&start=2020-05-10&end=2026-05-20
        [Authorize(Roles = "doctor,admin")]
        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<object>>> UpcomingByDoctorId(decimal doctorId, DateTime? start, DateTime? end, int? limit, int? skip)
        {
            if (UserIsDoctorAndDoesntHaveAccess(doctorId))
            {
                return Unauthorized(UnauthorizedEmptyJsonResult);
            }

            if (start == null || start > end || start < DateTime.Now)
            {
                start = DateTime.Now.Date;
            }
            if (end == null || end < DateTime.Now)
            {
                end = DateTime.Now.AddDays(7);
            } 
            
            return Ok(await _repository.DoctorScheduleList(doctorId, false, start, end, limit, skip));
        }

        // GET: api/reservations/Upcoming?PatientId=122&DoctorId=1&from=2022-12-30&to=2022-12-30&Limit=50&Skip=0
        [Authorize]
        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<object>>> Upcoming(decimal patientId, decimal? doctorId, DateTime? from, DateTime? to, int? limit, int? skip)
        {
            if (IsPatient())
            {
                if (patientId != GetUserIdFromToken())
                {
                    return Unauthorized(UnauthorizedEmptyJsonResult);
                }
                return Ok(await _repository.RecentOrUpcomingByPatientId(patientId, true, true, doctorId, from, to, limit, skip));
            }
            return Ok(await _repository.RecentOrUpcomingByPatientId(patientId, true, false, doctorId, from, to, limit, skip));
        }

        // GET: api/Reservations/Recent?PatientId=1&DoctorId=1&from=2022-12-30&to=2022-12-30&Limit=50&Skip=0
        [Authorize]
        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<object>>> Recent(decimal patientId, decimal? doctorId, DateTime? from, DateTime? to, int? limit, int? skip)
        {
            if (IsPatient())
            {
                if (patientId != GetUserIdFromToken())
                {
                    return Unauthorized(UnauthorizedEmptyJsonResult);
                }
                return Ok(await _repository.RecentOrUpcomingByPatientId(patientId, false, true, doctorId, from, to, limit, skip));
            }
            return Ok(await _repository.RecentOrUpcomingByPatientId(patientId, false, false, doctorId, from, to, limit, skip));
        }

        // GET: api/Reservations/Cancel/5
        [Authorize(Roles = "patient,doctor,admin")]
        [HttpGet("[action]/{reservationId}")]
        public async Task<IActionResult> Cancel(decimal reservationId)
        {
            if (!await _authorizationService.CanUserAccessVisit(reservationId, this)) return Unauthorized(UnauthorizedEmptyJsonResult);

            var result = await GetReservation(reservationId);
            if (result.Value == null)
            {
                return NotFound(NotFoundEmptyJsonResult);
            }
            var reservation = result.Value;
            reservation.Canceled = true;
            return await PutReservation(reservationId, reservation);
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
                return BadRequest(BadRequestJsonResult("Niepoprawne kryteria wyszukiwania"));
            }

            IEnumerable<Reservation> allReservations = _repository.AllReservationsForPossibleAppointments(cityId, specId, doctorId, startDate, endDate);
            IEnumerable<Workinghours> workinghours = _workHoursRepository.GetAllFutureWorkHours(cityId, specId, doctorId, startDate, endDate);

            Speciality doctorSpeciality;
            if (specId.HasValue)
            {
                doctorSpeciality = _specialitiesRepository.GetByID(specId.Value);
            }
            else
            {
                doctorSpeciality = (await _doctorsRepository.GetByIdWithSpecialization(doctorId.Value)).Speciality;
            }

            var slotList = CalcPossibleAppointments(allReservations, workinghours, doctorSpeciality);

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

        #region Slots
        private static IEnumerable<SlotDTO> CalcPossibleAppointments(IEnumerable<Reservation> allReservations, IEnumerable<Workinghours> workinghours, Speciality speciality)
        {
            var outputList = new List<SlotDTO>();

            foreach (var workDay in workinghours)
            {
                var reservationsThatDay = allReservations
                    .Where(res => res.Starttime.Date == workDay.From.Date)
                    .Where(res => res.Room.LocalId == workDay.LocalId)
                    .Where(res => res.DoctorId == workDay.DoctorId).ToList();

                var slotsThatDay = SplitDayIntoChunks(workDay, reservationsThatDay, speciality).ToList();
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

        private static IEnumerable<SlotDTO> SplitDayIntoChunks(Workinghours wh, List<Reservation> rlist, Speciality speciality)
        {
            var slotList = new List<SlotDTO>();
            var specialityVisitDurationMinutes =Convert.ToInt32(speciality.DurationOfVisit);

            if (rlist.Count > 0)
            {
                rlist = rlist.OrderBy(x => x.Starttime).ToList();
                //podziel na sloty, okres między początkiem pracy, a pierwszą wizytą
                slotList = SplitChunkIntoSlots(wh.From, rlist.First().Starttime, specialityVisitDurationMinutes);
                for (int i = 0; i < (rlist.Count - 1); i++)
                {
                    //podziel na sloty, okres między końcem i-tej wizyty, a początkiem (i+1)-szej wizyty
                    slotList.AddRange(SplitChunkIntoSlots(rlist.ElementAt(i).Endtime, rlist.ElementAt(i + 1).Starttime, specialityVisitDurationMinutes));
                }
                //podziel na sloty, okres między końcem ostatniej wizyty, a końcem dnia pracy
                slotList.AddRange(SplitChunkIntoSlots(rlist.Last().Endtime, wh.To, specialityVisitDurationMinutes));
            }
            else
            {
                //gdy nie ma wizyt tego dnia, podziel cały dzień na sloty
                slotList.AddRange(SplitChunkIntoSlots(wh.From, wh.To, specialityVisitDurationMinutes));
            }

            return slotList;
        }

        private static List<SlotDTO> SplitChunkIntoSlots (DateTime start, DateTime end, int minuteChunkSize)
        {
            var slots = new List<SlotDTO>();

            if ((start.AddMinutes(minuteChunkSize) <= end))
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
