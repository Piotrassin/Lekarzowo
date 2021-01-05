using FluentValidation;
using Lekarzowo.DataAccessLayer.Models;

namespace Lekarzowo.Validators
{
    public class TreatmentValidator : AbstractValidator<Treatment>
    {
        public TreatmentValidator()
        {
            RuleFor(x => x.Name)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Pole nie może być puste.")
                .MaximumLength(63).WithMessage("Maksymalna długość wynosi {MaxLength} znaków, wpisano {TotalLength}.");

            RuleFor(x => x.Price)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Pole nie może być puste.")
                .Must(x => x > 0).WithMessage("Niepoprawna wartość.");
        }
    }
}
