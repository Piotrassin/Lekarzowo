using FluentValidation;
using Lekarzowo.DataAccessLayer.DTO;
using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.Validators
{
    public class BaseReservationValidator : AbstractValidator<IReservation>
    {
        private readonly IWorkingHoursRepository _workHoursRepository;
        private readonly IReservationsRepository _reservationsRepository;

        public BaseReservationValidator(IDoctorsRepository docRepo, IPatientsRepository patRepo, IWorkingHoursRepository whRepo, IReservationsRepository resRepo)
        {
            _workHoursRepository = whRepo;
            _reservationsRepository = resRepo;

            RuleFor(x => x.DoctorId)
                .SetValidator(new BaseIdValidator<Doctor>(docRepo, "Niepoprawne dane lekarza"));

            RuleFor(x => x.PatientId)
                .SetValidator(new BaseIdValidator<Patient>(patRepo, "Niepoprawne dane pacjenta"));

            RuleFor(x => x.Canceled)
                .Cascade(CascadeMode.Stop)
                .NotNull().WithMessage("Pole nie może być puste.")
                .Must(x => x == false).WithMessage("Niepoprawny stan wizyty (odwołana).");

            RuleFor(x => x.Starttime)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Pole nie może być puste.")
                .Must(DateTimeValidator.BeInTheFuture).WithMessage("Rezerwacja musi zaczynać sie w przyszłości.");

            RuleFor(x => x.Endtime)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Pole nie może być puste.")
                .Must(DateTimeValidator.BeInTheFuture).WithMessage("Rezerwacja musi kończyć sie w przyszłości.");

            RuleFor(x => x)
                .Cascade(CascadeMode.Stop)
                .NotNull().WithMessage("Pole nie może być puste.")
                .Must(x => { return DateTimeValidator.BeOfAProperDuration(x.Starttime, x.Endtime); }).WithMessage("Niepoprawny czas trwania wizyty.");

        }

        public async Task<bool> BeOnAWorkDay(ReservationDTO res)
        {
            Workinghours wh = await _workHoursRepository.GetByDetails(res.DoctorId, res.LocalId, res.Starttime.Date);
            return wh != null && wh.From <= res.Starttime && wh.To >= res.Endtime;
        }

        public async Task<bool> BeOnAWorkDay(Reservation res, IRoomsRepository roomRepo)
        {
            Room room = roomRepo.GetByID(res.RoomId);
            Workinghours wh = await _workHoursRepository.GetByDetails(res.DoctorId, room.LocalId, res.Starttime.Date);
            return wh != null && wh.From <= res.Starttime && wh.To >= res.Endtime;
        }

        public async Task<bool> NotOverlapWithAnother(decimal localId, decimal doctorId, DateTime start, DateTime end)
        {
            return ! await _reservationsRepository.IsReservationOverlappingWithAnother(localId, doctorId, start, end);
        }

        public async Task<bool> NotOverlapWithAnother(IRoomsRepository roomRepo, decimal reservationId, decimal roomId, decimal doctorId, DateTime start, DateTime end)
        {
            Room room = roomRepo.GetByID(roomId);
            var overlappedReservations = await _reservationsRepository.OverlappingReservations(room.LocalId, doctorId, start, end);
            if (overlappedReservations.Count() == 1 && overlappedReservations.First().Id == reservationId)
            {
                return true;
            }
            return overlappedReservations.Count() == 0;

        }
    }
}
