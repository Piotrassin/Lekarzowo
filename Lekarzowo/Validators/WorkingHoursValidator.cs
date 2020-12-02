using FluentValidation;
using Lekarzowo.DataAccessLayer.DTO;
using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.Validators
{
    public class WorkingHoursValidator : AbstractValidator<WorkingHoursDTO>
    {
        public WorkingHoursValidator(IDoctorsRepository docRepo, ILocalsRepository locRepo)
        {
            RuleFor(x => x.DoctorId)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Pole nie może być puste.")
                .Must(new BaseValidator<Doctor>(docRepo).BeAValidId).WithMessage("Dany lekarz nie istnieje.");

            RuleFor(x => x.LocalId)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Pole nie może być puste.")
                .Must(new BaseValidator<Local>(locRepo).BeAValidId).WithMessage("Dany lokal nie istnieje.");

            RuleFor(x => x.From).SetValidator(new DateTimeValidator());

            RuleFor(x => x.To).SetValidator(new DateTimeValidator());

            RuleFor(x => x)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Pole nie może być puste.")
                .Must((x) => { return DateTimeValidator.BeOfAProperDuration(x.From, x.To); }).WithMessage("Niepoprawny czas trwania.");
        }
    }
}
