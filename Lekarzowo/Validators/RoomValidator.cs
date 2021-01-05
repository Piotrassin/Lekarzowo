using FluentValidation;
using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories;

namespace Lekarzowo.Validators
{
    public class RoomValidator : AbstractValidator<Room>
    {
        public RoomValidator(ILocalsRepository localsRepository)
        {
            RuleFor(x => x.Number)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Pole nie może być puste.")
                .Must(x => x > 0).WithMessage("Niepoprawna wartość.");

            RuleFor(x => x.LocalId)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Pole nie może być puste.")
                .SetValidator(new BaseIdValidator<Local>(localsRepository, "Lokal nie istnieje"));
        }
    }
}
