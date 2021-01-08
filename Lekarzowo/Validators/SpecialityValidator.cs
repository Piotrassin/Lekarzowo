using FluentValidation;
using Lekarzowo.Controllers;
using Lekarzowo.DataAccessLayer.Models;

namespace Lekarzowo.Validators
{
    public class SpecialityValidator : AbstractValidator<Speciality>
    {
        public SpecialityValidator()
        {
            RuleFor(x => x.Name)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Pole nie może być puste.")
                .MaximumLength(127).WithMessage("Maksymalna długość wynosi {MaxLength} znaków, wpisano {TotalLength}.");

            RuleFor(x => x.Price)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Pole nie może być puste.")
                .Must(x => x > 0).WithMessage("Niepoprawna wartość");

            RuleFor(x => x.DurationOfVisit)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Pole nie może być puste.")
                .Must(BeAValidDurationTime).WithMessage("Niepoprawna wartość");
        }

        private bool BeAValidDurationTime(decimal visitDuration)
        {
            var minDuration = ReservationsController.defaultChunkSizeMinutes;
            return visitDuration >= minDuration && visitDuration % minDuration == 0;
        }
    }
}
