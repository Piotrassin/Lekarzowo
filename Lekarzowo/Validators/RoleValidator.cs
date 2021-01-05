using FluentValidation;
using Lekarzowo.DataAccessLayer.Models;

namespace Lekarzowo.Validators
{
    public class RoleValidator : AbstractValidator<Role>
    {
        public RoleValidator()
        {
            RuleFor(x => x.Name)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Pole nie może być puste.")
                .MaximumLength(15).WithMessage("Maksymalna długość wynosi {MaxLength} znaków, wpisano {TotalLength}.");
        }
    }
}
