using FluentValidation;
using Lekarzowo.DataAccessLayer.DTO;
using Lekarzowo.Repositories;

namespace Lekarzowo.Validators
{
    public class PersonLoginValidator : AbstractValidator<PersonLoginDTO>
    {
        private readonly PasswordValidator passwordValidator;
        public PersonLoginValidator(IPeopleRepository peopleRepository) 
        {
            passwordValidator = new PasswordValidator(peopleRepository);

            RuleFor(x => x.Email)
               .Cascade(CascadeMode.Stop)
               .NotEmpty().WithMessage("{PropertyName} musi mieć wartość").WithName("Email");

            RuleFor(x => x.Password.Value)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("{PropertyName} musi mieć wartość").WithName("Hasło")
                .Must(BeEqualToAPwdInDB).WithMessage("{PropertyName} lub adres email są niepoprawne");
        }

        bool BeEqualToAPwdInDB(PersonLoginDTO user, string pwd)
        {
            return passwordValidator.BeEqualToAPasswordInDatabase(user.Email, user.Password.Value);
        }
    }
}
