using FluentValidation;
using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;

namespace Lekarzowo.Validators
{
    public class ReservationValidator : AbstractValidator<Reservation>
    {
        public ReservationValidator(IWorkingHoursRepository whRepo, IDoctorsRepository docRepo, IRoomsRepository roomRepo, IPatientsRepository patRepo, IReservationsRepository resRepo)
        {
            var baseReservationValidator = new BaseReservationValidator(docRepo, patRepo, whRepo, resRepo);

            RuleFor(x => x)
                .Cascade(CascadeMode.Stop)
                .SetValidator(baseReservationValidator)
                .MustAsync((x, cancellation) => baseReservationValidator.BeOnAWorkDay(x, roomRepo)).WithMessage("Rezerwacja nie znajduje się wewnątrz godzin pracy lekarza.")
                .MustAsync((x, cancellation) => baseReservationValidator.NotOverlapWithAnother(roomRepo, x.Id, x.RoomId, x.DoctorId, x.Starttime, x.Endtime))
                .WithMessage("Rezerwacja nie jest możliwa w wybranym terminie.");

            RuleFor(x => x.RoomId)
                .SetValidator(new BaseIdValidator<Room>(roomRepo, "Niepoprawne dane pokoju"));
        }
    }
}
