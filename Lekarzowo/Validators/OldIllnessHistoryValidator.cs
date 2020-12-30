using FluentValidation;
using Lekarzowo.DataAccessLayer.Models;
using System;
using Lekarzowo.DataAccessLayer.Repositories;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;

namespace Lekarzowo.Validators
{
    public class OldIllnessHistoryValidator : AbstractValidator<Oldillnesshistory>
    {
        public OldIllnessHistoryValidator(IIllnessesRepository illnessesRepository, IPatientsRepository patientsRepository)
        {
            RuleFor(x => x.IllnessId)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Pole nie może być puste.")
                .SetValidator(new BaseIdValidator<Illness>(illnessesRepository, "Choroba nie istnieje."));

            RuleFor(x => x.Patient)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Pole nie może być puste.")
                .SetValidator(new BaseIdValidator<Patient>(patientsRepository, "Pacjent nie istnieje."));

            RuleFor(x => x.Date)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Pole nie może być puste")
                .Must(x => x.Date < DateTime.Now.Date).WithMessage("Data nie może być w przyszłości");

            RuleFor(x => x.Description)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Pole nie może być puste")
                .MaximumLength(1023).WithMessage("Maksymalna długość wynosi {MaxLength} znaków, wpisano {TotalLength}.");

            RuleFor(x => x)
                .Cascade(CascadeMode.Stop)
                .Must(x => x.Curedate.Value >= x.Date)
                .When(x => x.Curedate.HasValue).WithMessage("Data końcowa nie może być wcześniejsza niż początkowa.");

        }
    }
}
