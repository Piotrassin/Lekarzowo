using FluentValidation;
using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;

namespace Lekarzowo.Validators
{
    public class VisitValidator : AbstractValidator<Visit>
    {
        public VisitValidator(IReservationsRepository reservationsRepository)
        {
            RuleFor(x => x.ReservationId)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Pole nie może być puste.")
                .SetValidator(new BaseIdValidator<Reservation>(reservationsRepository, "Rezerwacja nie istnieje."));

            //RuleFor(x => x.Price)
            //    .Cascade(CascadeMode.Stop)
            //    .NotNull().WithMessage("Pole nie może być puste.")
            //    .Must(x => x > 0).When(x => x != null).WithMessage("Niepoprawna wartość");

            RuleFor(x => x.Description)
                .Cascade(CascadeMode.Stop)
                .MaximumLength(1023).WithMessage("Maksymalna długość wynosi {MaxLength} znaków, wpisano {TotalLength}.");

            RuleFor(x => x.OnGoing)
                .Cascade(CascadeMode.Stop)
                .NotNull().WithMessage("Pole nie może być puste.")
                .Must(x => x == true || x == false).WithMessage("Niepoprawna wartość");
        }
    }
}
