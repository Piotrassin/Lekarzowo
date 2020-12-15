using FluentValidation;
using Lekarzowo.DataAccessLayer.DTO;
using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;

namespace Lekarzowo.Validators
{
    public class ReservationDTOValidator : AbstractValidator<ReservationDTO>
    {
        public ReservationDTOValidator(IWorkingHoursRepository whRepo, IDoctorsRepository docRepo, ILocalsRepository locRepo, IPatientsRepository patRepo, IReservationsRepository resRepo)
        {
            var baseReservationValidator = new BaseReservationValidator(docRepo, patRepo, whRepo, resRepo);

            RuleFor(x => x)
                .Cascade(CascadeMode.Stop)
                .SetValidator(baseReservationValidator)
                .MustAsync((x, cancellation) => baseReservationValidator.BeOnAWorkDay(x)).WithMessage("Rezerwacja nie znajduje się wewnątrz godzin pracy lekarza.")
                .MustAsync((x, cancellation) => baseReservationValidator.NotOverlapWithAnother(x.LocalId, x.DoctorId, x.Starttime, x.Endtime)).WithMessage("Rezerwacja nie jest możliwa w wybranym terminie.");

            RuleFor(x => x.LocalId)
                .SetValidator(new BaseIdValidator<Local>(locRepo, "Niepoprawne dane lokalu"));
        }
    }
}
