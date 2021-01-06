using FluentValidation;
using Lekarzowo.DataAccessLayer.DTO;
using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;

namespace Lekarzowo.Validators
{
    public class VisitDescriptionOnlyDTOValidator : AbstractValidator<VisitDescriptionOnlyDTO>
    {
        public VisitDescriptionOnlyDTOValidator(IReservationsRepository reservationsRepository)
        {
            RuleFor(x => x.Id)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Pole nie może być puste.")
                .SetValidator(new BaseIdValidator<Reservation>(reservationsRepository, "Rezerwacja nie istnieje."));


            RuleFor(x => x.Description)
                .Cascade(CascadeMode.Stop)
                .MaximumLength(1023).WithMessage("Maksymalna długość wynosi {MaxLength} znaków, wpisano {TotalLength}.");
        }
    }
}
