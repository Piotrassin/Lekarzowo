using FluentValidation;
using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using Lekarzowo.Repositories;

namespace Lekarzowo.Validators.UserValidators
{
    public class PersonAsDoctorRegistrationValidator : AbstractValidator<PersonAsDoctorRegistrationDTO>
    {
        public PersonAsDoctorRegistrationValidator(IPeopleRepository peopleRepository, ISpecialitiesRepository specRepo)
        {
            RuleFor(x => x)
                .SetValidator(new BasePersonValidator());

            RuleFor(x => x.Email)
                .Must(x => !peopleRepository.Exists(x))
                .WithMessage("{PropertyName} jest już zarejestrowany systemie")
                .WithName("Email");

            RuleFor(x => x.Password)
                .SetValidator(new PasswordValidator(peopleRepository));

            RuleFor(x => x.SpecialityId)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Pole nie może być puste.")
                .SetValidator(new BaseIdValidator<Speciality>(specRepo, "Specjalizacja nie istnieje"));
        }
    }
}
