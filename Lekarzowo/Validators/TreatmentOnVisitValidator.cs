using FluentValidation;
using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;

namespace Lekarzowo.Validators
{
    public class TreatmentOnVisitValidator : AbstractValidator<Treatmentonvisit>
    {
        public TreatmentOnVisitValidator(ITreatmentsRepository treatmentsRepository, IVisitsRepository visitsRepository)
        {
            RuleFor(x => x.TreatmentId)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Pole nie może być puste.")
                .SetValidator(new BaseIdValidator<Treatment>(treatmentsRepository, "Zabieg nie istnieje."));

            RuleFor(x => x.VisitId)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Pole nie może być puste.")
                .Must(visitId => visitsRepository.Exists(visitId)).WithMessage("Wizyta nie istnieje.");

            RuleFor(x => x.Description)
                .Cascade(CascadeMode.Stop)
                .MaximumLength(511).WithMessage("Maksymalna długość wynosi {MaxLength} znaków, wpisano {TotalLength}.");
        }
    }
}
