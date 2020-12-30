using FluentValidation;
using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories;

namespace Lekarzowo.Validators
{
    public class MedicineHistoryValidator : AbstractValidator<Medicinehistory>
    {
        public MedicineHistoryValidator(IMedicinesRepository medicinesRepository, IIllnessesHistoryRepository illnessesHistoryRepository)
        {
            RuleFor(x => x.MedicineId)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Pole nie może być puste.")
                .SetValidator(new BaseIdValidator<Medicine>(medicinesRepository, "Lek nie istnieje."));

            RuleFor(x => x.IllnesshistoryId)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Pole nie może być puste.")
                .SetValidator(new BaseIdValidator<Illnesshistory>(illnessesHistoryRepository, "Historia choroby nie istnieje."));

            RuleFor(x => x.Startdate)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Pole nie może być puste.");

            RuleFor(x => x)
                .Cascade(CascadeMode.Stop)
                .Must(x => x.Finishdate.Value >= x.Startdate)
                .When(x => x.Finishdate.HasValue).WithMessage("Data końcowa nie może być wcześniejsza niż początkowa.");

            RuleFor(x => x.Description)
                .Cascade(CascadeMode.Stop)
                .MaximumLength(255).WithMessage("Maksymalna długość wynosi {MaxLength} znaków, wpisano {TotalLength}.");
        }
    }
}
