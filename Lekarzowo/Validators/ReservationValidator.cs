using FluentValidation;
using Lekarzowo.Controllers;
using Lekarzowo.DataAccessLayer.DTO;
using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.Validators
{
    public class ReservationValidator : AbstractValidator<ReservationDTO>
    {
        private readonly IWorkingHoursRepository _workHoursRepository;

        public ReservationValidator(IWorkingHoursRepository whRepo, IDoctorsRepository docRepo, ILocalsRepository locRepo, IPatientsRepository patRepo)
        {
            _workHoursRepository = whRepo;

            var dateTimeValidator = new DateTimeValidator();

            RuleFor(x => x.DoctorId)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Pole nie może być puste.")
                .Must(new BaseValidator<Doctor>(docRepo).BeAValidId).WithMessage("Dany lekarz nie istnieje.");

            RuleFor(x => x.LocalId)
                .NotEmpty().WithMessage("Pole nie może być puste.")
                .Must(new BaseValidator<Local>(locRepo).BeAValidId).WithMessage("Dany lokal nie istnieje.");

            RuleFor(x => x.PatientId)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Pole nie może być puste.")
                .Must(new BaseValidator<Patient>(patRepo).BeAValidId).WithMessage("Dany pacjent nie istnieje.");

            RuleFor(x => x.Canceled)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Pole nie może być puste.")
                .Must(x => x.Value == 0).WithMessage("Niepoprawny stan wizyty (odwołana).");

            RuleFor(x => x.Starttime)
                .SetValidator(dateTimeValidator);

            RuleFor(x => x.Endtime)
                .SetValidator(dateTimeValidator);

            RuleFor(x => x)
                .Cascade(CascadeMode.Stop)
                .Must((x) => { return DateTimeValidator.BeOfAProperDuration(x.Starttime, x.Endtime); }).WithMessage("Niepoprawny czas trwania.")
                .MustAsync((x, cancellation) => BeOnAWorkDay(x)).WithMessage("Tego dnia lekarz nie przyjmuje pacjentów.");

        }

        protected async Task<bool> BeOnAWorkDay(ReservationDTO res)
        {
            Workinghours wh = await _workHoursRepository.GetByDetails(res.DoctorId, res.LocalId, res.Starttime.Date);
            return wh != null && wh.From <= res.Starttime && wh.To >= res.Endtime;
        }
    }
}
