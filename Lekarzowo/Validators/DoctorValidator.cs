using FluentValidation;
using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using Lekarzowo.Repositories;
using Microsoft.AspNetCore.Http;

namespace Lekarzowo.Validators
{
    public class DoctorValidator : AbstractValidator<Doctor>
    {
        public DoctorValidator(ISpecialitiesRepository specRepo, IPeopleRepository pepRepo, 
            IDoctorsRepository docRepo, IHttpContextAccessor httpContext)
        {

            var baseIdValidator = new BaseIdValidator<Doctor>(docRepo, "");
            RuleFor(x => x.Id)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Pole nie może być puste.")
                .SetValidator(new BaseIdValidator<Person>(pepRepo, "Osoba nie istnieje."))
                    .When(x => x.Id > 0)
                .Must(x => baseIdValidator.NotExist(x)).WithMessage("Osoba jest już lekarzem.")
                    .When(x => x.Id > 0 && httpContext.HttpContext.Request.Method.ToUpper() == "POST");

            RuleFor(x => x.SpecialityId)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Pole nie może być puste.")
                .SetValidator(new BaseIdValidator<Speciality>(specRepo, "Specjalizacja nie istnieje"));
        }
    }
}
