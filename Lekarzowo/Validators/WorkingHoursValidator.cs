using FluentValidation;
using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.Validators
{
    public class WorkingHoursValidator : AbstractValidator<Workinghours>
    {
        private readonly IWorkingHoursRepository _workingHoursRepository;
        public WorkingHoursValidator(IDoctorsRepository docRepo, ILocalsRepository locRepo, IWorkingHoursRepository whRepo)
        {
            _workingHoursRepository = whRepo;

            RuleFor(x => x.DoctorId).SetValidator(new BaseIdValidator<Doctor>(docRepo, "Niepoprawne dane lekarza."));

            RuleFor(x => x.LocalId).SetValidator(new BaseIdValidator<Local>(locRepo, "Niepoprawne dane lokalu."));

            RuleFor(x => x.From)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Pole nie może być puste.")
                .Must(DateTimeValidator.BeInTheFuture).WithMessage("Godziny pracy nie mogą być w przeszłości");

            RuleFor(x => x.To)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Pole nie może być puste.")
                .Must(DateTimeValidator.BeInTheFuture).WithMessage("Godziny pracy nie mogą być w przeszłości"); ;

            RuleFor(x => x)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Pole nie może być puste.")
                .Must((x) => { return DateTimeValidator.BeOfAProperDuration(x.From, x.To); }).WithMessage("Niepoprawny czas trwania.")
                .MustAsync((x, cancellation) => NotOverlapWithDifferentWorkHours(x)).WithMessage("Godziny pracy kolidują z innymi godzinami pracy lekarza.");
        }

        protected async Task<bool> NotOverlapWithDifferentWorkHours(Workinghours x)
        {
            var overlappingWorkHours = await _workingHoursRepository.IsWorkingHourOverlapping(x);
            if (overlappingWorkHours.Count() == 1 && overlappingWorkHours.First().Id == x.Id)
            {
                return true;
            }
            return overlappingWorkHours.Count() == 0;
        }
    }
}
