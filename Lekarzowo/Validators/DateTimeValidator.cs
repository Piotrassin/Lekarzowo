using FluentValidation;
using Lekarzowo.Controllers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.Validators
{
    public class DateTimeValidator : AbstractValidator<DateTime>
    {
        protected static int chunkSizeMinutes = ReservationsController.chunkSizeMinutes;

        public DateTimeValidator()
        {
            RuleFor(x => x)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Pole nie może być puste.")
                .Must(BeInTheFuture).WithMessage("Data nie może być w przeszłości");
        }

        /// <summary>
        /// TODO: Móc wywoływać ten konstruktor przyjmujący dwie daty z nad-walidatora tak jak zwykły kontruktor.
        /// </summary>
        /// <param name="start"></param>
        /// <param name="end"></param>
        public DateTimeValidator(DateTime start, DateTime end)
        {
            RuleFor(x => x)
                .Cascade(CascadeMode.Stop)
                .NotNull().WithMessage("Pole nie może być puste.")
                .Must((x) => { return BeOfAProperDuration(start, end); }).WithMessage("Niepoprawny czas trwania.");
        }

        public static bool BeInTheFuture(DateTime date)
        {
            return date >= DateTime.Now;
        }

        public static bool BeOfAProperDuration(DateTime start, DateTime end)
        {
            return start.TimeOfDay.TotalMinutes % chunkSizeMinutes == 0
            && end.TimeOfDay.TotalMinutes % chunkSizeMinutes == 0
            && (end - start).TotalMinutes >= chunkSizeMinutes;
        }
    }
}
