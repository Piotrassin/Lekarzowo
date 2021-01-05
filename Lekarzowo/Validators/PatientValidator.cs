using FluentValidation;
using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using Lekarzowo.Repositories;
using Microsoft.AspNetCore.Http;

namespace Lekarzowo.Validators
{
    public class PatientValidator : AbstractValidator<Patient>
    {
        public PatientValidator(IPeopleRepository peopleRepository, IPatientsRepository patientsRepository, 
            IHttpContextAccessor httpContext)
        {
            RuleFor(x => x.Id)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Pole nie może być puste.");

            RuleFor(x => x.Id)
                .SetValidator(new BaseIdValidator<Person>(peopleRepository, "Osoba nie istnieje."))
                .When(x => x.Id > 0);

            RuleFor(x => x.Id)
                .Cascade(CascadeMode.Stop)
                .Must(x => new BaseIdValidator<Patient>(patientsRepository, "").NotExist(x))
                    .WithMessage("Osoba jest już pacjentem")
                    .When(x => x.Id > 0 && httpContext.HttpContext.Request.Method.ToUpper() == "POST");
        }
    }
}
