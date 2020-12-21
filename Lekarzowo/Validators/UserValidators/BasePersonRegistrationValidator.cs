using FluentValidation;
using Lekarzowo.DataAccessLayer;
using Lekarzowo.Repositories;

namespace Lekarzowo.Validators.UserValidators
{
    public class BasePersonRegistrationValidator : AbstractValidator<IPersonRegistrationDTO>
    {
        public BasePersonRegistrationValidator(IPeopleRepository peopleRepository)
        {
            RuleFor(x => x)
                .SetValidator(new BasePersonValidator());

            RuleFor(x => x.Email)
                .Must(x => !peopleRepository.Exists(x))
                .WithMessage("{PropertyName} jest już zarejestrowany systemie")
                .WithName("Email");

            RuleFor(x => x.Password)
                .SetValidator(new PasswordValidator(peopleRepository));
        }
    }
}
