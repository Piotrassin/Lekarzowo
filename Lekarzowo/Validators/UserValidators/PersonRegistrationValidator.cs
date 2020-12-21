using FluentValidation;
using Lekarzowo.DataAccessLayer.DTO;
using Lekarzowo.Repositories;
using Lekarzowo.Validators.UserValidators;

namespace Lekarzowo.Validators
{
    public class PersonRegistrationValidator : AbstractValidator<PersonRegistrationDTO>
    {
        public PersonRegistrationValidator(IPeopleRepository peopleRepository)
        {
            RuleFor(x => x)
                .SetValidator(new BasePersonRegistrationValidator(peopleRepository));
        }
    }
}
