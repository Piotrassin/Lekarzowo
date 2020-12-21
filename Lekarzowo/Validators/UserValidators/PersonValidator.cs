using FluentValidation;
using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.Repositories;
using Lekarzowo.Validators.UserValidators;

namespace Lekarzowo.Validators
{
    public class PersonValidator : AbstractValidator<Person>
    {
        public PersonValidator(IPeopleRepository repo)
        {
            var basePersonDtoValidator = new BasePersonValidator();

            RuleFor(x => x)
                .SetValidator(basePersonDtoValidator);
        }
    }
}
