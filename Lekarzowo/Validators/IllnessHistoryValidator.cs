using FluentValidation;
using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using Microsoft.AspNetCore.Http;

namespace Lekarzowo.Validators
{
    public class IllnessHistoryValidator : AbstractValidator<Illnesshistory>
    {
        public IllnessHistoryValidator(IIllnessesHistoryRepository illHistRepo, IPatientsRepository patRepo,
            IIllnessesRepository illRepo, IVisitsRepository visitRepo, IHttpContextAccessor httpContext)
        {
            RuleFor(x => x.PatientId)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Pole nie może być puste.")
                .SetValidator(new BaseIdValidator<Patient>(patRepo, "Pacjent nie istnieje."));

            RuleFor(x => x.IllnessId)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Pole nie może być puste.")
                .SetValidator(new BaseIdValidator<Illness>(illRepo, "Choroba nie istnieje."));

            RuleFor(x => x.VisitId)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Pole nie może być puste.")
                .Must(x => visitRepo.Exists(x)).WithMessage("Wizyta nie istnieje.");

            RuleFor(x => x.Description)
                .MaximumLength(1023).WithMessage("Maksymalna długość wynosi {MaxLength} znaków, wpisano {TotalLength}.");
        }
    }
}
