using FluentValidation;
using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using System;

namespace Lekarzowo.Validators
{
    public class OldMedicineHistoryValidator : AbstractValidator<Oldmedicinehistory>
    {
        public OldMedicineHistoryValidator(IMedicinesRepository medicinesRepository, IPatientsRepository patientsRepository)
        {
            RuleFor(x => x.MedicineId)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Pole nie może być puste.")
                .SetValidator(new BaseIdValidator<Medicine>(medicinesRepository, "Choroba nie istnieje."));

            RuleFor(x => x.PatientId)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Pole nie może być puste.")
                .SetValidator(new BaseIdValidator<Patient>(patientsRepository, "Pacjent nie istnieje."));

            RuleFor(x => x.Date)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Pole nie może być puste")
                .Must(x => x.Date < DateTime.Now.Date).WithMessage("Data nie może być w przyszłości");

            RuleFor(x => x.Description)
                .Cascade(CascadeMode.Stop)
                .MaximumLength(1023).WithMessage("Maksymalna długość wynosi {MaxLength} znaków, wpisano {TotalLength}.");

            RuleFor(x => x)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Pole nie może być puste");
        }
    }
}
