using FluentValidation;
using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;

namespace Lekarzowo.Validators
{
    public class SpecialityValidator : AbstractValidator<Speciality>
    {
        public SpecialityValidator(ISpecialitiesRepository specialitiesRepository)
        {
            RuleFor(x => x.Name)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Pole nie może być puste.")
                .MaximumLength(127).WithMessage("Maksymalna długość wynosi {MaxLength} znaków, wpisano {TotalLength}.");

            RuleFor(x => x.Price)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Pole nie może być puste.")
                .Must(x => x > 0).WithMessage("Niepoprawna wartość");
        }
    }
}
