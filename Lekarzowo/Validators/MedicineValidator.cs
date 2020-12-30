using FluentValidation;
using Lekarzowo.DataAccessLayer.Models;

namespace Lekarzowo.Validators
{
    public class MedicineValidator : AbstractValidator<Medicine>
    {
        public MedicineValidator()
        {
            RuleFor(x => x.Name)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Pole nie może być puste")
                .MaximumLength(127).WithMessage("Maksymalna długość wynosi {MaxLength} znaków, wpisano {TotalLength}.");
        }
    }
}
