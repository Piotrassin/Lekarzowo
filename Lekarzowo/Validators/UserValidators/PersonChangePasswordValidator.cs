using FluentValidation;
using Lekarzowo.DataAccessLayer.DTO;
using Lekarzowo.Repositories;

namespace Lekarzowo.Validators
{
    public class PersonChangePasswordValidator : AbstractValidator<PersonChangePasswordDTO>
    {
        private readonly PasswordValidator pwdValidator;
        public PersonChangePasswordValidator(IPeopleRepository peopleRepository)
        {
            pwdValidator = new PasswordValidator(peopleRepository);

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("{PropertyName} musi mieć wartość").WithName("To pole");

            RuleFor(x => x.CurrentPassword)
                .NotEmpty().WithMessage("{PropertyName} musi mieć wartość").WithName("To pole");

            RuleFor(x => x.NewPassword)
                .SetValidator(pwdValidator);

            RuleFor(x => x.ConfirmPassword)
                .SetValidator(pwdValidator);

            RuleFor(x => x.ConfirmPassword.Value)
                .Equal(x => x.NewPassword.Value).WithMessage("Hasła muszą być identyczne");
        }

        //TODO: Powinno dotyczyć CurrentPassword, ale trzeba najpierw zmienić hasła na hashowane tym użytkownikom testowym, którzy jeszcze mają je w plaintexcie
        bool BeEqualToAPwdInDb(PersonChangePasswordDTO user, PasswordDTO pwd)
        {
            return pwdValidator.BeEqualToAPasswordInDatabase(user.Email, user.CurrentPassword.Value);
        }
    }
}
